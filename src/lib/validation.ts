import type { ProductInput } from '../types';

export function validateProduct(v: ProductInput): string | null {
  if (v.name.trim().length < 2) return 'Informe o nome do produto.';
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(v.slug)) return 'Endereço (slug) inválido: use letras minúsculas, números e hífens.';
  if (!Number.isFinite(v.price) || v.price < 0) return 'Preço inválido.';
  if (v.promo_price != null && (!Number.isFinite(v.promo_price) || v.promo_price < 0 || v.promo_price >= v.price))
    return 'O preço promocional deve ser menor que o preço normal.';
  if (!Number.isInteger(v.stock) || v.stock < 0) return 'Estoque deve ser um número inteiro maior ou igual a zero.';
  if ((v.short_description ?? '').length > 300) return 'Resumo: máximo de 300 caracteres.';
  return null;
}

export const parseMoney = (raw: string) => {
  const s = raw.trim().replace(/^R\$\s*/i, '');
  if (!s) return NaN;
  // "1.234,56" ou "289,90" (padrão brasileiro) e também "289.90".
  return Number(s.includes(',') ? s.replace(/\./g, '').replace(',', '.') : s);
};
