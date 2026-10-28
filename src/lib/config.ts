const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anonKey);

/**
 * Modo demonstração: usado apenas quando o Supabase NÃO está configurado
 * (ex.: pré-visualização no GitHub Pages). Os dados ficam só no navegador.
 * Com o Supabase configurado, o modo demonstração é sempre desativado.
 */
export const demoMode = !supabaseConfigured;

export const supabaseUrl = url ?? '';
export const supabaseAnonKey = anonKey ?? '';
export const siteUrl = ((import.meta.env.VITE_SITE_URL as string | undefined) ?? '').replace(/\/$/, '');
