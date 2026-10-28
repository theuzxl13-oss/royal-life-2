import type { Product } from '../types';
import { effectivePrice, hasPromo } from './format';

export interface ProductFilters {
  q?: string;
  category?: string; // id
  brand?: string; // id
  minPrice?: number;
  maxPrice?: number;
  availability?: 'all' | 'in_stock' | 'out_of_stock';
  promo?: boolean;
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'name';
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function filterProducts(products: Product[], f: ProductFilters, brandNames: Record<string, string> = {}) {
  const terms = f.q ? norm(f.q).split(/\s+/).filter(Boolean) : [];
  let list = products.filter((p) => {
    if (f.category && p.category_id !== f.category) return false;
    if (f.brand && p.brand_id !== f.brand) return false;
    const price = effectivePrice(p);
    if (f.minPrice != null && price < f.minPrice) return false;
    if (f.maxPrice != null && price > f.maxPrice) return false;
    if (f.availability === 'in_stock' && p.stock <= 0) return false;
    if (f.availability === 'out_of_stock' && p.stock > 0) return false;
    if (f.promo && !hasPromo(p)) return false;
    if (terms.length) {
      const hay = norm([p.name, p.brand_id ? brandNames[p.brand_id] : '', p.short_description ?? '', p.volume ?? ''].join(' '));
      if (!terms.every((t) => hay.includes(t))) return false;
    }
    return true;
  });
  switch (f.sort) {
    case 'price_asc':
      list = [...list].sort((a, b) => effectivePrice(a) - effectivePrice(b));
      break;
    case 'price_desc':
      list = [...list].sort((a, b) => effectivePrice(b) - effectivePrice(a));
      break;
    case 'newest':
      list = [...list].sort((a, b) => b.created_at.localeCompare(a.created_at));
      break;
    case 'name':
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      break;
    default:
      // Disponíveis primeiro, depois destaques.
      list = [...list].sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0) || Number(b.featured) - Number(a.featured));
  }
  return list;
}
