import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { optimizeImage } from '../lib/image';
import type { Banner, Brand, Category, CreatedOrder, Order, Product, Settings } from '../types';
import { ApiError, defaultSettings, type AdminSession, type Api } from './api';

const db = () => {
  if (!supabase) throw new ApiError('Supabase não configurado.');
  return supabase;
};

function check<T>(res: { data: T; error: { message: string; code?: string } | null }): T {
  if (res.error) {
    if (res.error.code === '23505') throw new ApiError('Já existe um registro com este endereço (slug).');
    if (res.error.code === '42501') throw new ApiError('Sem permissão para esta ação.');
    throw new ApiError(res.error.message);
  }
  return res.data;
}

const toProduct = (row: any): Product => ({
  ...row,
  price: Number(row.price),
  promo_price: row.promo_price == null ? null : Number(row.promo_price),
  images: ((row.images ?? []) as string[]).map(resolveLocal),
});

// Fotos que vêm junto com o site (public/produtos) são salvas como "/produtos/arquivo".
const resolveLocal = (src: string) =>
  src.startsWith('/') && !src.startsWith('//') ? import.meta.env.BASE_URL.replace(/\/$/, '') + src : src;

async function sessionToAdmin(session: Session | null): Promise<AdminSession | null> {
  if (!session?.user) return null;
  const { data } = await db().from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle();
  return { email: session.user.email ?? '', isAdmin: Boolean(data) };
}

const productColumns =
  'id,name,slug,brand_id,category_id,volume,short_description,description,details,price,promo_price,stock,images,featured,is_new,active,created_at';

export const supabaseApi: Api = {
  async getSettings() {
    const data = check(await db().from('settings').select('*').eq('id', 1).maybeSingle());
    return { ...defaultSettings, ...(data ?? {}) } as Settings;
  },
  async updateSettings(values) {
    const data = check(await db().from('settings').update(values).eq('id', 1).select('*').single());
    return { ...defaultSettings, ...data } as Settings;
  },

  async listCategories(includeInactive = false) {
    let q = db().from('categories').select('*').order('sort_order').order('name');
    if (!includeInactive) q = q.eq('active', true);
    return check(await q) as Category[];
  },
  async saveCategory(values, id) {
    const q = id ? db().from('categories').update(values).eq('id', id) : db().from('categories').insert(values);
    return check(await q.select('*').single()) as Category;
  },
  async deleteCategory(id) {
    check(await db().from('categories').delete().eq('id', id));
  },

  async listBrands() {
    return check(await db().from('brands').select('*').order('name')) as Brand[];
  },
  async saveBrand(values, id) {
    const q = id ? db().from('brands').update(values).eq('id', id) : db().from('brands').insert(values);
    return check(await q.select('*').single()) as Brand;
  },
  async deleteBrand(id) {
    check(await db().from('brands').delete().eq('id', id));
  },

  async listProducts(includeInactive = false) {
    let q = db().from('products').select(productColumns).order('created_at', { ascending: false });
    if (!includeInactive) q = q.eq('active', true);
    return (check(await q) as any[]).map(toProduct);
  },
  async getProductBySlug(slug) {
    const data = check(await db().from('products').select(productColumns).eq('slug', slug).maybeSingle());
    return data ? toProduct(data) : null;
  },
  async getProduct(id) {
    const data = check(await db().from('products').select(productColumns).eq('id', id).maybeSingle());
    return data ? toProduct(data) : null;
  },
  async saveProduct(values, id) {
    const q = id ? db().from('products').update(values).eq('id', id) : db().from('products').insert(values);
    return toProduct(check(await q.select(productColumns).single()));
  },
  async deleteProduct(id) {
    check(await db().from('products').delete().eq('id', id));
  },

  async listBanners(includeInactive = false) {
    let q = db().from('banners').select('*').order('sort_order');
    if (!includeInactive) q = q.eq('active', true);
    return check(await q) as Banner[];
  },
  async saveBanner(values, id) {
    const q = id ? db().from('banners').update(values).eq('id', id) : db().from('banners').insert(values);
    return check(await q.select('*').single()) as Banner;
  },
  async deleteBanner(id) {
    check(await db().from('banners').delete().eq('id', id));
  },

  async uploadImage(file, folder) {
    if (!file.type.startsWith('image/')) throw new ApiError('Envie apenas arquivos de imagem.');
    if (file.size > 15 * 1024 * 1024) throw new ApiError('Imagem muito grande (máx. 15 MB antes da otimização).');
    const blob = await optimizeImage(file);
    const ext = blob.type === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await db().storage.from('catalog').upload(path, blob, {
      contentType: blob.type || file.type,
      cacheControl: '31536000',
    });
    if (error) throw new ApiError(`Falha no envio da imagem: ${error.message}`);
    return db().storage.from('catalog').getPublicUrl(path).data.publicUrl;
  },

  async createOrder(customerName, notes, lines) {
    const items = lines.map((l) => ({ product_id: l.productId, quantity: l.quantity }));
    const { data, error } = await db().rpc('create_order', {
      p_customer_name: customerName,
      p_notes: notes,
      p_items: items,
    });
    if (error) throw new ApiError(error.message);
    const row = (Array.isArray(data) ? data[0] : data) as any;
    const created: CreatedOrder = {
      id: row.order_id,
      code: row.order_code,
      total: Number(row.order_total),
      items: (row.order_items as any[]).map((i) => ({
        ...i,
        unit_price: Number(i.unit_price),
        subtotal: Number(i.subtotal),
      })),
    };
    return created;
  },
  async listOrders() {
    const data = check(await db().from('orders').select('*').order('created_at', { ascending: false }).limit(500));
    return (data as any[]).map((o) => ({ ...o, total: Number(o.total) })) as Order[];
  },
  async updateOrderStatus(id, status) {
    check(await db().from('orders').update({ status }).eq('id', id));
  },

  async signIn(email, password) {
    const { data, error } = await db().auth.signInWithPassword({ email, password });
    if (error) throw new ApiError('E-mail ou senha inválidos.');
    const admin = await sessionToAdmin(data.session);
    if (!admin?.isAdmin) {
      await db().auth.signOut();
      throw new ApiError('Este usuário não tem permissão de administrador.');
    }
    return admin;
  },
  async signOut() {
    await db().auth.signOut();
  },
  async getSession() {
    const { data } = await db().auth.getSession();
    return sessionToAdmin(data.session);
  },
  onAuthChange(cb) {
    const { data } = db().auth.onAuthStateChange((_event, session) => {
      // Evita chamadas ao banco dentro do callback de auth (recomendação do Supabase).
      setTimeout(() => sessionToAdmin(session).then(cb), 0);
    });
    return () => data.subscription.unsubscribe();
  },
};
