import { describe, expect, it } from 'vitest';
import { filterProducts } from '../lib/filters';
import { effectivePrice, formatPrice, slugify } from '../lib/format';
import { parseMoney, validateProduct } from '../lib/validation';
import { normalizePhone, orderMessage, whatsappLink } from '../lib/whatsapp';
import { storeBrands, storeProducts as demoProducts } from '../services/storeCatalog';

describe('catálogo da loja', () => {
  it('15 produtos com preços informados e slugs válidos e únicos', () => {
    expect(demoProducts.length).toBe(15);
    expect(new Set(demoProducts.map((p) => p.slug)).size).toBe(15);
    demoProducts.forEach((p) => expect(validateProduct(p)).toBeNull());
    expect(demoProducts.find((p) => p.name === 'Sauvage')?.price).toBe(699.9);
    expect(demoProducts.every((p) => p.promo_price === null && !p.demo)).toBe(true);
  });
});

describe('format', () => {
  it('slugify remove acentos e símbolos', () => {
    expect(slugify('Âmbar Oriental 100 ml!')).toBe('ambar-oriental-100-ml');
  });
  it('preço efetivo considera promoção apenas se menor', () => {
    expect(effectivePrice({ price: 100, promo_price: 80 })).toBe(80);
    expect(effectivePrice({ price: 100, promo_price: 120 })).toBe(100);
    expect(effectivePrice({ price: 100, promo_price: null })).toBe(100);
  });
  it('parseMoney aceita padrão brasileiro', () => {
    expect(parseMoney('289,90')).toBe(289.9);
    expect(parseMoney('1.234,56')).toBe(1234.56);
    expect(parseMoney('289.90')).toBe(289.9);
    expect(parseMoney('R$ 10,00')).toBe(10);
    expect(parseMoney('')).toBeNaN();
  });
});

describe('filtros', () => {
  const brands = Object.fromEntries(storeBrands.map((b) => [b.id, b.name]));
  it('busca por nome sem acento e por marca', () => {
    expect(filterProducts(demoProducts, { q: 'sauvage' }, brands).map((p) => p.name)).toEqual(['Sauvage']);
    expect(filterProducts(demoProducts, { q: 'lancome' }, brands).map((p) => p.name)).toEqual(['La Vie Est Belle']);
    expect(filterProducts(demoProducts, { q: 'lattafa' }, brands).length).toBe(3);
  });
  it('filtra por categoria, preço e disponibilidade', () => {
    expect(filterProducts(demoProducts, { category: 'cat-arabes' }).length).toBe(4);
    expect(filterProducts(demoProducts, { category: 'cat-body-splash' }).length).toBe(2);
    expect(filterProducts(demoProducts, { maxPrice: 300 }).every((p) => effectivePrice(p) <= 300)).toBe(true);
    const withOut = demoProducts.map((p, i) => (i === 0 ? { ...p, stock: 0 } : p));
    expect(filterProducts(withOut, { availability: 'out_of_stock' }).map((p) => p.id)).toEqual([demoProducts[0].id]);
    expect(filterProducts(withOut, { availability: 'in_stock' }).every((p) => p.stock > 0)).toBe(true);
    expect(filterProducts(demoProducts, { promo: true }).length).toBe(0);
  });
  it('ordena por preço', () => {
    const list = filterProducts(demoProducts, { sort: 'price_asc' });
    for (let i = 1; i < list.length; i++) expect(effectivePrice(list[i])).toBeGreaterThanOrEqual(effectivePrice(list[i - 1]));
  });
});

describe('whatsapp', () => {
  it('normaliza número e monta link', () => {
    expect(normalizePhone('+55 (11) 99999-8888')).toBe('5511999998888');
    expect(whatsappLink('+55 11 99999-8888', 'oi')).toBe('https://wa.me/5511999998888?text=oi');
    expect(whatsappLink('', 'oi')).toBe('https://wa.me/?text=oi');
  });
  it('mensagem de pedido lista itens, quantidades, preços e total', () => {
    const msg = orderMessage({
      storeName: 'Royal Life',
      code: 'RL1',
      customerName: 'Ana',
      notes: 'Presente',
      items: [{ name: 'Perfume X', volume: '100 ml', quantity: 2, unit_price: 50, subtotal: 100 }],
      total: 100,
    });
    expect(msg).toContain('*Pedido:* RL1');
    expect(msg).toContain('*Nome:* Ana');
    expect(msg).toContain('1. Perfume X (100 ml)');
    expect(msg).toContain(`2 x ${formatPrice(50)} = ${formatPrice(100)}`);
    expect(msg).toContain(`*Total:* ${formatPrice(100)}`);
    expect(msg).toContain('*Observações:* Presente');
  });
});

describe('validação de produto', () => {
  const base = { ...demoProducts[0] };
  it('aceita produto válido', () => expect(validateProduct(base)).toBeNull());
  it('rejeita promoção maior que o preço', () => expect(validateProduct({ ...base, promo_price: base.price + 1 })).toMatch(/promocional/));
  it('rejeita estoque negativo', () => expect(validateProduct({ ...base, stock: -1 })).toMatch(/Estoque/));
  it('rejeita slug inválido', () => expect(validateProduct({ ...base, slug: 'Com Espaço' })).toMatch(/slug/));
});
