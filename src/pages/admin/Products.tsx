import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Notice from '../../components/admin/Notice';
import Spinner from '../../components/Spinner';
import { useStore } from '../../context/StoreContext';
import { formatPrice, hasPromo } from '../../lib/format';
import { api } from '../../services';
import type { Product } from '../../types';

export default function Products() {
  const { brandName, categoryById, refresh, categories } = useStore();
  const [params] = useSearchParams();
  const [items, setItems] = useState<Product[] | null>(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [onlyOut, setOnlyOut] = useState(params.get('estoque') === '0');
  const [error, setError] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState(categories);

  const load = () => api.listProducts(true).then(setItems).catch((e) => setError(e.message));
  useEffect(() => {
    load();
    api.listCategories(true).then(setAllCategories).catch(() => undefined);
  }, []);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (items ?? []).filter(
      (p) => (!term || p.name.toLowerCase().includes(term)) && (!cat || p.category_id === cat) && (!onlyOut || p.stock <= 0),
    );
  }, [items, q, cat, onlyOut]);

  const patch = async (p: Product, changes: Partial<Product>) => {
    setError(null);
    try {
      const { id, created_at, demo, ...rest } = p;
      void created_at;
      void demo;
      await api.saveProduct({ ...rest, ...changes }, id);
      await load();
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao salvar.');
    }
  };

  const remove = async (p: Product) => {
    if (!window.confirm(`Excluir "${p.name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await api.deleteProduct(p.id);
      await load();
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao excluir.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Produtos</h1>
        <Link to="/admin/produtos/novo" className="btn-gold">Novo produto</Link>
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="sr-only" htmlFor="p-search">Buscar</label>
        <input id="p-search" className="input max-w-xs" placeholder="Buscar por nome" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="sr-only" htmlFor="p-cat">Categoria</label>
        <select id="p-cat" className="input max-w-[200px]" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">Todas as categorias</option>
          {allCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5 accent-[#c9a54c]" checked={onlyOut} onChange={(e) => setOnlyOut(e.target.checked)} /> Sem estoque</label>
      </div>
      {error && <Notice kind="error">{error}</Notice>}
      {!items ? <Spinner /> : !list.length ? (
        <p className="card text-cream/70">Nenhum produto. <Link to="/admin/produtos/novo" className="text-gold underline">Cadastre o primeiro</Link>.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((p) => (
            <li key={p.id} className="card flex flex-wrap items-center gap-4 p-3 sm:p-4">
              <div className="h-20 w-16 shrink-0 overflow-hidden rounded bg-ink-700">
                {p.images[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" loading="lazy" />}
              </div>
              <div className="min-w-[180px] flex-1">
                <p className="font-medium">
                  {p.name} {p.demo && <span className="badge ml-1 bg-cream text-ink">demo</span>}
                  {!p.active && <span className="badge ml-1 bg-white/10 text-cream/70">inativo</span>}
                </p>
                <p className="text-xs text-cream/60">
                  {[brandName(p.brand_id), categoryById(p.category_id)?.name ?? allCategories.find((c) => c.id === p.category_id)?.name, p.volume].filter(Boolean).join(' · ')}
                </p>
                <p className="mt-1 text-sm">
                  {hasPromo(p) ? <><span className="text-cream/50 line-through">{formatPrice(p.price)}</span> <span className="text-gold-light">{formatPrice(p.promo_price!)}</span></> : formatPrice(p.price)}
                  <span className={`ml-3 ${p.stock <= 0 ? 'text-red-300' : 'text-cream/70'}`}>Estoque: {p.stock}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <label className="flex items-center gap-1.5"><input type="checkbox" className="h-4 w-4 accent-[#c9a54c]" checked={p.featured} onChange={(e) => patch(p, { featured: e.target.checked })} /> Destaque</label>
                <label className="flex items-center gap-1.5"><input type="checkbox" className="h-4 w-4 accent-[#c9a54c]" checked={p.active} onChange={(e) => patch(p, { active: e.target.checked })} /> Ativo</label>
                <Link to={`/admin/produtos/${p.id}`} className="btn-outline py-1.5">Editar</Link>
                <button type="button" className="btn-danger" onClick={() => remove(p)}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
