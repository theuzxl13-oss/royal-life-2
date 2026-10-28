const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anonKey);

/**
 * Modo demonstração: só liga com VITE_DEMO_MODE=true E sem Supabase configurado
 * (ex.: prévia no GitHub Pages). Os dados ficam só no navegador e o login de teste
 * é público, então ele nunca liga sozinho em produção.
 */
export const demoMode = !supabaseConfigured && import.meta.env.VITE_DEMO_MODE === 'true';

export const supabaseUrl = url ?? '';
export const supabaseAnonKey = anonKey ?? '';
export const siteUrl = ((import.meta.env.VITE_SITE_URL as string | undefined) ?? '').replace(/\/$/, '');
