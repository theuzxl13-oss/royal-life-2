import { blobToDataUrl, optimizeImage } from '../lib/image';
import type { Banner, Brand, Category, Order, Product, Settings } from '../types';
import { ApiError, type AdminSession, type Api } from './api';
import { demoBanners, demoCategories, demoSettings } from './demoData';
import { storeBrands, storeProducts } from './storeCatalog';
import { effectivePrice } from '../lib/format';

/**
 * Implementação de DEMONSTRAÇÃO (sem banco). Usada apenas quando o Supabase
 * não está configurado, para pré-visualizar o site. Os dados ficam somente
 * neste navegador e NÃO são uma solução de produção.
 */
const KEY = 'royal-life-demo-v4';
const AUTH_KEY = 'royal-life-demo-auth';
export const DEMO_ADMIN = { email: 'demo@royallife.local', password: 'demo1234' };

interface Store {
  settings: Settings;
  categories: Category[];
  brands: Brand[];
  products: Product[];
  banners: Banner[];
  orders: Order[];
}

const seed = (): Store => ({
  settings: demoSettings,
  categories: demoCategories,
  brands: storeBrands,
  products: storeProducts,
  banners: demoBanners,
  orders: [],
});

let memory: Store | null = null;

function load(): Store {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    memory = raw ? { ...seed(), ...JSON.parse(raw) } : seed();
  } catch {
    memory = seed();
  }
  return memory!;
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    // Armazenamento cheio ou bloqueado: mantém em memória.
  }
}

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
const delay = <T>(v: T) => new Promise<T>((r) => setTimeout(() => r(structuredClone(v)), 60));

function requireAdmin() {
  if (!currentSession()) throw new ApiError('Faça login para continuar.');
}

function currentSession(): AdminSession | null {
  try {
    return sessionStorage.getItem(AUTH_KEY) ? { email: DEMO_ADMIN.email, isAdmin: true } : null;
  } catch {
    return null;
  }
}

const listeners = new Set<(s: AdminSession | null) => void>();

function upsert<T extends { id: string }>(list: T[], values: Omit<T, 'id'>, id?: string): T {
  if (id) {
    const idx = list.findIndex((x) => x.id === id);
    if (idx < 0) throw new ApiError('Registro não encontrado.');
    list[idx] = { ...list[idx], ...values, id };
    return list[idx];
  }
  const item = { ...(values as object), id: uid() } as T;
  list.push(item);
  return item;
}

function assertUniqueSlug(list: { id: string; slug: string }[], slug: string, id?: string) {
  if (list.some((x) => x.slug === slug && x.id !== id)) throw new ApiError('Já existe um registro com este endereço (slug).');
}

export const demoApi: Api = {
  async getSettings() {
    return delay(load().settings);
  },
  async updateSettings(values) {
    requireAdmin();
    const s = load();
    s.settings = { ...s.settings, ...values };
    save();
    return delay(s.settings);
  },

  async listCategories(includeInactive = false) {
    const list = [...load().categories].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
    return delay(includeInactive ? list : list.filter((c) => c.active));
  },
  async saveCategory(values, id) {
    requireAdmin();
    assertUniqueSlug(load().categories, values.slug, id);
    const item = upsert(load().categories, values, id);
    save();
    return delay(item);
  },
  async deleteCategory(id) {
    requireAdmin();
    const s = load();
    s.categories = s.categories.filter((c) => c.id !== id);
    s.products.forEach((p) => p.category_id === id && (p.category_id = null));
    save();
  },

  async listBrands() {
    return delay([...load().brands].sort((a, b) => a.name.localeCompare(b.name)));
  },
  async saveBrand(values, id) {
    requireAdmin();
    assertUniqueSlug(load().brands, values.slug, id);
    const item = upsert(load().brands, values, id);
    save();
    return delay(item);
  },
  async deleteBrand(id) {
    requireAdmin();
    const s = load();
    s.brands = s.brands.filter((b) => b.id !== id);
    s.products.forEach((p) => p.brand_id === id && (p.brand_id = null));
    save();
  },

  async listProducts(includeInactive = false) {
    const list = [...load().products].sort((a, b) => b.created_at.localeCompare(a.created_at));
    return delay(includeInactive ? list : list.filter((p) => p.active));
  },
  async getProductBySlug(slug) {
    const p = load().products.find((x) => x.slug === slug && (x.active || currentSession()));
    return delay(p ?? null);
  },
  async getProduct(id) {
    return delay(load().products.find((x) => x.id === id) ?? null);
  },
  async saveProduct(values, id) {
    requireAdmin();
    assertUniqueSlug(load().products, values.slug, id);
    const list = load().products;
    let item: Product;
    if (id) {
      item = upsert(list, values as Omit<Product, 'id'>, id);
    } else {
      item = { ...values, id: uid(), created_at: new Date().toISOString() };
      list.push(item);
    }
    save();
    return delay(item);
  },
  async deleteProduct(id) {
    requireAdmin();
    const s = load();
    s.products = s.products.filter((p) => p.id !== id);
    save();
  },

  async listBanners(includeInactive = false) {
    const list = [...load().banners].sort((a, b) => a.sort_order - b.sort_order);
    return delay(includeInactive ? list : list.filter((b) => b.active));
  },
  async saveBanner(values, id) {
    requireAdmin();
    const item = upsert(load().banners, values, id);
    save();
    return delay(item);
  },
  async deleteBanner(id) {
    requireAdmin();
    const s = load();
    s.banners = s.banners.filter((b) => b.id !== id);
    save();
  },

  async uploadImage(file) {
    requireAdmin();
    if (!file.type.startsWith('image/')) throw new ApiError('Envie apenas arquivos de imagem.');
    const blob = await optimizeImage(file, 900, 0.75);
    return blobToDataUrl(blob);
  },

  async createOrder(customerName, notes, lines) {
    if (customerName.trim().length < 2) throw new ApiError('Informe seu nome.');
    if (!lines.length) throw new ApiError('O carrinho está vazio.');
    const s = load();
    const items = lines.map((l) => {
      const p = s.products.find((x) => x.id === l.productId && x.active);
      if (!p) throw new ApiError('Produto indisponível.');
      if (l.quantity < 1 || l.quantity > p.stock) throw new ApiError(`Quantidade indisponível para ${p.name}.`);
      const unit = effectivePrice(p);
      return { product_id: p.id, name: p.name, volume: p.volume, quantity: l.quantity, unit_price: unit, subtotal: unit * l.quantity };
    });
    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    const now = new Date();
    const code = `RL${now.toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(16).slice(2, 7).toUpperCase()}`;
    const order: Order = {
      id: uid(),
      code,
      customer_name: customerName.trim(),
      notes: notes.trim() || null,
      items,
      total,
      status: 'novo',
      created_at: now.toISOString(),
    };
    s.orders.unshift(order);
    save();
    return delay({ id: order.id, code, total, items });
  },
  async listOrders() {
    requireAdmin();
    return delay(load().orders);
  },
  async updateOrderStatus(id, status) {
    requireAdmin();
    const o = load().orders.find((x) => x.id === id);
    if (!o) throw new ApiError('Pedido não encontrado.');
    o.status = status;
    save();
  },

  async signIn(email, password) {
    if (email.trim().toLowerCase() !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
      throw new ApiError('E-mail ou senha inválidos.');
    }
    sessionStorage.setItem(AUTH_KEY, '1');
    const session = currentSession();
    listeners.forEach((l) => l(session));
    return session!;
  },
  async signOut() {
    sessionStorage.removeItem(AUTH_KEY);
    listeners.forEach((l) => l(null));
  },
  async getSession() {
    return currentSession();
  },
  onAuthChange(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export function resetDemoData() {
  memory = seed();
  save();
}
