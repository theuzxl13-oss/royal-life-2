import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from './Icons';
import Logo from './Logo';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `px-1 py-2 text-sm tracking-wide transition hover:text-gold-light ${isActive ? 'text-gold-light' : 'text-cream/85'}`;

export default function Header() {
  const { count } = useCart();
  const { categories } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState(params.get('q') ?? '');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (setMenuOpen(false), setSearchOpen(false));
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/catalogo${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
  };

  const searchForm = (id: string) => (
    <form role="search" onSubmit={submit} className="relative w-full">
      <label htmlFor={id} className="sr-only">
        Buscar produtos
      </label>
      <input
        id={id}
        ref={id === 'search-mobile' ? searchRef : undefined}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar perfume, marca…"
        className="input pr-11"
        autoComplete="off"
      />
      <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-2 text-gold hover:text-gold-light" aria-label="Buscar">
        <SearchIcon width={18} height={18} />
      </button>
    </form>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
      <div className="container-page flex h-16 items-center gap-3 md:h-20">
        <button type="button" className="icon-btn md:hidden" aria-label="Abrir menu" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(true)}>
          <MenuIcon />
        </button>
        <Link to="/" className="mx-auto shrink-0 md:mx-0" aria-label="Página inicial">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="ml-8 hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={navClass}>Início</NavLink>
          <NavLink to="/catalogo" className={navClass}>Catálogo</NavLink>
          <NavLink to="/sobre" className={navClass}>Sobre</NavLink>
        </nav>
        <div className="ml-auto hidden w-72 lg:block">{searchForm('search-desktop')}</div>
        <div className="flex items-center gap-1 md:ml-auto lg:ml-2">
          <button type="button" className="icon-btn lg:hidden" aria-label="Abrir busca" aria-expanded={searchOpen} onClick={() => setSearchOpen((v) => !v)}>
            <SearchIcon />
          </button>
          <Link to="/carrinho" className="icon-btn relative" aria-label={`Carrinho, ${count} ${count === 1 ? 'item' : 'itens'}`}>
            <BagIcon />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.65rem] font-semibold text-ink" aria-hidden>
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
      {searchOpen && <div className="container-page pb-3 lg:hidden">{searchForm('search-mobile')}</div>}

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-black/70" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />
          <nav className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col gap-1 overflow-y-auto border-r border-gold/20 bg-ink-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <Logo compact />
              <button type="button" className="icon-btn" aria-label="Fechar menu" onClick={() => setMenuOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <Link className="mobile-link" to="/">Início</Link>
            <Link className="mobile-link" to="/catalogo">Todo o catálogo</Link>
            {categories.length > 0 && <p className="mt-4 text-xs uppercase tracking-[0.2em] text-gold">Categorias</p>}
            {categories.map((c) => (
              <Link key={c.id} className="mobile-link" to={`/catalogo/${c.slug}`}>{c.name}</Link>
            ))}
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-gold">Institucional</p>
            <Link className="mobile-link" to="/sobre">Sobre</Link>
            <Link className="mobile-link" to="/condicoes-de-compra">Condições de compra</Link>
            <Link className="mobile-link" to="/privacidade">Privacidade</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
