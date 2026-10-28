const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatPrice = (value: number) => brl.format(value);

export const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

export const effectivePrice = (p: { price: number; promo_price: number | null }) =>
  p.promo_price != null && p.promo_price < p.price ? p.promo_price : p.price;

export const hasPromo = (p: { price: number; promo_price: number | null }) =>
  p.promo_price != null && p.promo_price < p.price;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
