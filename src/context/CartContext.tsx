import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { effectivePrice } from '../lib/format';
import type { CartLine, Product } from '../types';
import { useStore } from './StoreContext';

const KEY = 'royal-life-cart';

export interface CartItem extends CartLine {
  product: Product;
  unitPrice: number;
  subtotal: number;
}

interface CartState {
  lines: CartLine[];
  items: CartItem[];
  count: number;
  total: number;
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartState | null>(null);

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((l) => typeof l?.productId === 'string' && Number.isInteger(l?.quantity) && l.quantity > 0)
      : [];
  } catch {
    return [];
  }
}

/** Carrinho: mantido no navegador do cliente (os pedidos vão para o banco). */
export function CartProvider({ children }: { children: ReactNode }) {
  const { products, loading } = useStore();
  const [lines, setLines] = useState<CartLine[]>(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* ignora */
    }
  }, [lines]);

  const stockOf = useCallback((id: string) => products.find((p) => p.id === id)?.stock ?? 0, [products]);

  // Ajusta o carrinho ao estoque atual (produto removido ou estoque reduzido).
  useEffect(() => {
    if (loading) return;
    setLines((prev) => {
      const next = prev
        .map((l) => ({ ...l, quantity: Math.min(l.quantity, stockOf(l.productId)) }))
        .filter((l) => l.quantity > 0);
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
  }, [loading, stockOf]);

  const add = useCallback(
    (productId: string, quantity = 1) =>
      setLines((prev) => {
        const max = stockOf(productId);
        const existing = prev.find((l) => l.productId === productId);
        const nextQty = Math.min(max, (existing?.quantity ?? 0) + quantity);
        if (nextQty <= 0) return prev;
        return existing
          ? prev.map((l) => (l.productId === productId ? { ...l, quantity: nextQty } : l))
          : [...prev, { productId, quantity: nextQty }];
      }),
    [stockOf],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) =>
      setLines((prev) => {
        const q = Math.max(0, Math.min(stockOf(productId), Math.floor(quantity)));
        return q === 0 ? prev.filter((l) => l.productId !== productId) : prev.map((l) => (l.productId === productId ? { ...l, quantity: q } : l));
      }),
    [stockOf],
  );

  const remove = useCallback((productId: string) => setLines((prev) => prev.filter((l) => l.productId !== productId)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(() => {
    const items: CartItem[] = lines.flatMap((l) => {
      const product = products.find((p) => p.id === l.productId);
      if (!product) return [];
      const unitPrice = effectivePrice(product);
      return [{ ...l, product, unitPrice, subtotal: unitPrice * l.quantity }];
    });
    return {
      lines,
      items,
      count: items.reduce((s, i) => s + i.quantity, 0),
      total: items.reduce((s, i) => s + i.subtotal, 0),
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [lines, products, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart fora do CartProvider');
  return ctx;
}
