import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CloseIcon, FilterIcon } from '../components/Icons';
import ProductGrid from '../components/ProductGrid';
import Spinner from '../components/Spinner';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../hooks/useSeo';
import { filterProducts, type ProductFilters } from '../lib/filters';

const sortOptions: { value: NonNullable<ProductFilters['sort']>; label: string }[] = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'newest', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'name', label: 'Nome (A–Z)' },
];

const toNumber = (v: string | null) => {
  if (!v) return undefined;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export default function Catalog() {
  const { categoria } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, categories, brands, loading, error } = useStore();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = categories.find((c) => c.slug === categoria);
  const brand = brands.find((b) => b.slug === params.get('marca'));
  const filters: ProductFilters = {
    q: params.get('q') ?? undefined,
    category: category?.id,
    brand: brand?.id,
    minPrice: toNumber(params.get('min')),
    maxPrice: toNumber(params.get('max')),
    availability: (params.get('disponibilidade') as ProductFilters['availability']) || 'all',
    promo: params.get('ofertas') === '1',
    sort: (params.get('ordem') as ProductFilters['sort']) || 'relevance',
  };

  const brandNames = useMemo(() => Object.fromEntries(brands.map((b) => [b.id, b.name])), [brands]);
  const list = useMemo(
    () => filterProducts(products, filters, brandNames),
    [products, brandNames, params.toString(), category?.id],
  );

  const title = category ? category.name : filters.q ? `Busca: “${filters.q}”` : 'Catálogo';
  useSeo({
    title: category ? `${category.name} — Catálogo` : 'Catálogo de perfumes',
    description: category?.description ?? 'Veja perfumes, body splash, kits e hidratantes com preço e disponibilidade. Peça pelo WhatsApp.',
  });

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const setCategory = (slug: string) => navigate({ pathname: slug ? `/catalogo/${slug}` : '/catalogo', search: params.toString() });

  const activeCount = [category, brand, filters.minPrice, filters.maxPrice, filters.availability !== 'all' ? 1 : undefined, filters.promo || undefined, filters.q]
    .filter((v) => v !== undefined).length;

  const clearAll = () => navigate('/catalogo');

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <label htmlFor="f-q" className="label">Nome</label>
        <input id="f-q" type="search" className="input" defaultValue={filters.q} key={filters.q} placeholder="Ex.: floral, 100 ml"
          onKeyDown={(e) => e.key === 'Enter' && update('q', (e.target as HTMLInputElement).value.trim() || null)}
          onBlur={(e) => update('q', e.target.value.trim() || null)} />
      </div>
      <div>
        <label htmlFor="f-cat" className="label">Categoria</label>
        <select id="f-cat" className="input" value={category?.slug ?? ''} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="f-brand" className="label">Marca</label>
        <select id="f-brand" className="input" value={brand?.slug ?? ''} onChange={(e) => update('marca', e.target.value || null)}>
          <option value="">Todas</option>
          {brands.map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}
        </select>
      </div>
      <fieldset>
        <legend className="label">Preço (R$)</legend>
        <div className="flex items-center gap-2">
          <label htmlFor="f-min" className="sr-only">Preço mínimo</label>
          <input id="f-min" inputMode="decimal" className="input" placeholder="Mín." defaultValue={params.get('min') ?? ''} key={`min-${params.get('min')}`}
            onBlur={(e) => update('min', toNumber(e.target.value) != null ? String(toNumber(e.target.value)) : null)}
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} />
          <span className="text-cream/50" aria-hidden>–</span>
          <label htmlFor="f-max" className="sr-only">Preço máximo</label>
          <input id="f-max" inputMode="decimal" className="input" placeholder="Máx." defaultValue={params.get('max') ?? ''} key={`max-${params.get('max')}`}
            onBlur={(e) => update('max', toNumber(e.target.value) != null ? String(toNumber(e.target.value)) : null)}
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} />
        </div>
      </fieldset>
      <div>
        <label htmlFor="f-av" className="label">Disponibilidade</label>
        <select id="f-av" className="input" value={filters.availability} onChange={(e) => update('disponibilidade', e.target.value === 'all' ? null : e.target.value)}>
          <option value="all">Todos</option>
          <option value="in_stock">Em estoque</option>
          <option value="out_of_stock">Esgotados</option>
        </select>
      </div>
      <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm">
        <input type="checkbox" className="h-5 w-5 accent-[#c9a54c]" checked={filters.promo} onChange={(e) => update('ofertas', e.target.checked ? '1' : null)} />
        Somente ofertas
      </label>
      {activeCount > 0 && (
        <button type="button" onClick={clearAll} className="btn-ghost w-full justify-center border border-white/10">Limpar filtros</button>
      )}
    </div>
  );

  return (
    <div className="container-page py-10">
      <nav aria-label="Trilha" className="text-xs text-cream/60">
        <Link to="/" className="hover:text-gold-light">Início</Link> <span aria-hidden>/</span>{' '}
        {category ? <><Link to="/catalogo" className="hover:text-gold-light">Catálogo</Link> <span aria-hidden>/</span> <span aria-current="page">{category.name}</span></> : <span aria-current="page">Catálogo</span>}
      </nav>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{title}</h1>
          <p className="mt-1 text-sm text-cream/60" aria-live="polite">
            {loading ? 'Carregando…' : `${list.length} ${list.length === 1 ? 'produto' : 'produtos'}`}
            {categoria && !category && !loading && ' — categoria não encontrada'}
          </p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button type="button" className="btn-outline flex-1 lg:hidden" onClick={() => setFiltersOpen(true)} aria-expanded={filtersOpen} aria-controls="filters-drawer">
            <FilterIcon width={16} height={16} /> Filtros{activeCount ? ` (${activeCount})` : ''}
          </button>
          <label htmlFor="sort" className="sr-only">Ordenar por</label>
          <select id="sort" className="input flex-1 sm:w-48" value={filters.sort} onChange={(e) => update('ordem', e.target.value === 'relevance' ? null : e.target.value)}>
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 lg:hidden" aria-label="Categorias">
        <button type="button" onClick={() => setCategory('')} className={`shrink-0 rounded-full border px-4 py-2 text-sm ${!category ? 'border-gold bg-gold text-ink' : 'border-white/15 text-cream/80'}`}>Todos</button>
        {categories.map((c) => (
          <button key={c.id} type="button" onClick={() => setCategory(c.slug)} className={`shrink-0 rounded-full border px-4 py-2 text-sm ${category?.id === c.id ? 'border-gold bg-gold text-ink' : 'border-white/15 text-cream/80'}`}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtros">{filterPanel}</aside>
        <div>
          {loading ? <Spinner /> : error ? <p className="text-red-300">{error}</p> : (
            <ProductGrid products={list} empty="Nenhum produto corresponde aos filtros. Tente ajustar a busca." />
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros" id="filters-drawer">
          <button type="button" className="absolute inset-0 bg-black/70" aria-label="Fechar filtros" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-gold/30 bg-ink-900 p-5 pb-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl">Filtros</h2>
              <button type="button" className="icon-btn" aria-label="Fechar filtros" onClick={() => setFiltersOpen(false)}><CloseIcon /></button>
            </div>
            {filterPanel}
            <button type="button" className="btn-gold mt-6 w-full" onClick={() => setFiltersOpen(false)}>Ver {list.length} produtos</button>
          </div>
        </div>
      )}
    </div>
  );
}
