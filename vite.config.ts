import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Trava de segurança: um build de produção sem banco e sem pedir a demonstração
// geraria um site quebrado. A demonstração (login de teste público) precisa ser pedida.
function assertProductionConfig(command: string, mode: string) {
  if (command !== 'build' || mode !== 'production') return;
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const hasSupabase = Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY);
  if (!hasSupabase && env.VITE_DEMO_MODE !== 'true') {
    throw new Error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (ou VITE_DEMO_MODE=true só para prévias).');
  }
}

export default defineConfig(({ command, mode }) => {
  assertProductionConfig(command, mode);
  return {
    // VITE_BASE_PATH permite publicar em subpasta (ex.: GitHub Pages em /royal-life-2/).
    base: process.env.VITE_BASE_PATH || '/',
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: { supabase: ['@supabase/supabase-js'], react: ['react', 'react-dom', 'react-router-dom'] },
        },
      },
    },
    test: { environment: 'jsdom' },
  };
}) as any;
