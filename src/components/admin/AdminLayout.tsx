import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSeo } from '../../hooks/useSeo';
import { demoMode } from '../../lib/config';
import { CloseIcon, MenuIcon } from '../Icons';
import Logo from '../Logo';

const links = [
  { to: '/admin', label: 'Painel', end: true },
  { to: '/admin/produtos', label: 'Produtos' },
  { to: '/admin/categorias', label: 'Categorias' },
  { to: '/admin/marcas', label: 'Marcas' },
  { to: '/admin/banners', label: 'Banners' },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/configuracoes', label: 'Configurações' },
];

export default function AdminLayout() {
  const { session, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useSeo({ title: 'Painel administrativo', noindex: true });
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const nav = (
    <nav aria-label="Administração" className="flex flex-col gap-1">
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.end}
          className={({ isActive }) => `rounded px-3 py-2.5 text-sm ${isActive ? 'bg-gold/15 text-gold-light' : 'text-cream/80 hover:bg-white/5'}`}>
          {l.label}
        </NavLink>
      ))}
      <Link to="/" className="mt-4 rounded px-3 py-2.5 text-sm text-cream/60 hover:bg-white/5" target="_blank">Ver site ↗</Link>
      <button type="button" onClick={signOut} className="rounded px-3 py-2.5 text-left text-sm text-cream/60 hover:bg-white/5">Sair</button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-ink-900">
      {demoMode && (
        <div className="bg-cream px-4 py-1.5 text-center text-xs text-ink">
          <strong>Modo demonstração:</strong> alterações ficam salvas apenas neste navegador. Configure o Supabase para usar o banco real.
        </div>
      )}
      <header className="flex h-16 items-center gap-3 border-b border-gold/15 px-4 lg:hidden">
        <button type="button" className="icon-btn" aria-label="Abrir menu" onClick={() => setOpen(true)}><MenuIcon /></button>
        <Logo compact />
      </header>
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-gold/15 p-5 lg:flex">
          <Logo compact />
          <p className="mb-6 mt-2 truncate text-xs text-cream/50">{session?.email}</p>
          {nav}
        </aside>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu administrativo">
            <button type="button" className="absolute inset-0 bg-black/70" aria-label="Fechar menu" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-64 overflow-y-auto bg-ink-900 p-5">
              <div className="mb-4 flex items-center justify-between">
                <Logo compact />
                <button type="button" className="icon-btn" aria-label="Fechar menu" onClick={() => setOpen(false)}><CloseIcon /></button>
              </div>
              {nav}
            </div>
          </div>
        )}
        <main className="min-w-0 flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
