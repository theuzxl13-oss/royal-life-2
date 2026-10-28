import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../services';
import { defaultSettings } from '../services/api';
import type { Banner, Brand, Category, Product, Settings } from '../types';

interface StoreState {
  loading: boolean;
  error: string | null;
  settings: Settings;
  categories: Category[];
  brands: Brand[];
  products: Product[];
  banners: Banner[];
  brandName: (id: string | null) => string | undefined;
  categoryById: (id: string | null) => Category | undefined;
  refresh: () => Promise<void>;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);

  const refresh = useCallback(async () => {
    try {
      const [s, c, b, p, bn] = await Promise.all([
        api.getSettings(),
        api.listCategories(),
        api.listBrands(),
        api.listProducts(),
        api.listBanners(),
      ]);
      setSettings(s);
      setCategories(c);
      setBrands(b);
      setProducts(p);
      setBanners(bn);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível carregar o catálogo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo<StoreState>(() => {
    const brandMap = new Map(brands.map((b) => [b.id, b.name]));
    const catMap = new Map(categories.map((c) => [c.id, c]));
    return {
      loading,
      error,
      settings,
      categories,
      brands,
      products,
      banners,
      brandName: (id) => (id ? brandMap.get(id) : undefined),
      categoryById: (id) => (id ? catMap.get(id) : undefined),
      refresh,
    };
  }, [loading, error, settings, categories, brands, products, banners, refresh]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore fora do StoreProvider');
  return ctx;
}
