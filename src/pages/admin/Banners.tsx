import { useEffect, useState, type FormEvent } from 'react';
import ImageField from '../../components/admin/ImageField';
import Notice from '../../components/admin/Notice';
import Spinner from '../../components/Spinner';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services';
import type { Banner } from '../../types';

const blank: Omit<Banner, 'id'> = { title: '', subtitle: '', image_url: null, cta_label: 'Explorar catálogo', cta_link: '/catalogo', sort_order: 0, active: true };

export default function Banners() {
  const { refresh } = useStore();
  const [items, setItems] = useState<Banner[] | null>(null);
  const [editing, setEditing] = useState<{ id?: string; values: Omit<Banner, 'id'> } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => api.listBanners(true).then(setItems).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const setV = (patch: Partial<Banner>) => editing && setEditing({ ...editing, values: { ...editing.values, ...patch } });

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const v = editing.values;
    if (!v.title.trim()) return setError('Informe o título do banner.');
    if (v.cta_link && !/^(\/|https:\/\/)/.test(v.cta_link)) return setError('O link deve começar com / (página do site) ou https://');
    try {
      await api.saveBanner({ ...v, title: v.title.trim() }, editing.id);
      setEditing(null);
      setError(null);
      await load();
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar.');
    }
  };

  const remove = async (b: Banner) => {
    if (!window.confirm(`Excluir o banner "${b.title}"?`)) return;
    try {
      await api.deleteBanner(b.id);
      await load();
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao excluir.');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Banners da página inicial</h1>
        <button type="button" className="btn-gold" onClick={() => setEditing({ values: { ...blank, sort_order: (items?.length ?? 0) + 1 } })}>Novo banner</button>
      </div>
      <p className="text-sm text-cream/60">Sem banners ativos, a página inicial mostra o título e subtítulo definidos em Configurações.</p>
      {error && <Notice kind="error">{error}</Notice>}
      {editing && editing.values && (
        <form onSubmit={save} className="card grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="bn-title" className="label">Título *</label>
            <input id="bn-title" className="input" maxLength={120} value={editing.values.title} onChange={(e) => setV({ title: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="bn-sub" className="label">Subtítulo</label>
            <input id="bn-sub" className="input" maxLength={300} value={editing.values.subtitle ?? ''} onChange={(e) => setV({ subtitle: e.target.value })} />
          </div>
          <div>
            <label htmlFor="bn-cta" className="label">Texto do botão</label>
            <input id="bn-cta" className="input" maxLength={40} value={editing.values.cta_label ?? ''} onChange={(e) => setV({ cta_label: e.target.value })} />
          </div>
          <div>
            <label htmlFor="bn-link" className="label">Link do botão</label>
            <input id="bn-link" className="input" placeholder="/catalogo/femininos" value={editing.values.cta_link ?? ''} onChange={(e) => setV({ cta_link: e.target.value })} />
          </div>
          <div>
            <label htmlFor="bn-order" className="label">Ordem</label>
            <input id="bn-order" type="number" className="input" value={editing.values.sort_order} onChange={(e) => setV({ sort_order: Number(e.target.value) || 0 })} />
          </div>
          <label className="flex items-center gap-2 self-end pb-3 text-sm"><input type="checkbox" className="h-5 w-5 accent-[#c9a54c]" checked={editing.values.active} onChange={(e) => setV({ active: e.target.checked })} /> Ativo</label>
          <div className="sm:col-span-2">
            <ImageField label="Imagem de fundo (recomendado 1600×900)" folder="banners" value={editing.values.image_url ? [editing.values.image_url] : []} onChange={(u) => setV({ image_url: u[0] ?? null })} />
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" className="btn-gold">Salvar</button>
            <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancelar</button>
          </div>
        </form>
      )}
      {!items ? <Spinner /> : !items.length ? <p className="text-cream/60">Nenhum banner cadastrado.</p> : (
        <ul className="space-y-3">
          {items.map((b) => (
            <li key={b.id} className="card flex flex-wrap items-center gap-3 p-3">
              <div className="h-14 w-24 overflow-hidden rounded bg-ink-700">{b.image_url && <img src={b.image_url} alt="" className="h-full w-full object-cover" />}</div>
              <span className="min-w-[160px] flex-1">{b.title} {!b.active && <span className="badge bg-white/10">inativo</span>}</span>
              <button type="button" className="btn-outline py-1.5" onClick={() => { const { id, ...values } = b; setEditing({ id, values }); }}>Editar</button>
              <button type="button" className="btn-danger" onClick={() => remove(b)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
