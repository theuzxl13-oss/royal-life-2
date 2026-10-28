import { useEffect, useState, type FormEvent } from 'react';
import ImageField from '../../components/admin/ImageField';
import Notice from '../../components/admin/Notice';
import Spinner from '../../components/Spinner';
import { useStore } from '../../context/StoreContext';
import { slugify } from '../../lib/format';
import { api } from '../../services';
import type { Category } from '../../types';

const blank: Omit<Category, 'id'> = { name: '', slug: '', description: '', image_url: null, sort_order: 0, active: true };

export default function Categories() {
  const { refresh } = useStore();
  const [items, setItems] = useState<Category[] | null>(null);
  const [editing, setEditing] = useState<{ id?: string; values: Omit<Category, 'id'> } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => api.listCategories(true).then(setItems).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const v = { ...editing.values, name: editing.values.name.trim(), slug: editing.values.slug || slugify(editing.values.name) };
    if (v.name.length < 1 || !v.slug) return setError('Informe o nome da categoria.');
    try {
      await api.saveCategory(v, editing.id);
      setEditing(null);
      setError(null);
      await load();
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar.');
    }
  };

  const remove = async (c: Category) => {
    if (!window.confirm(`Excluir a categoria "${c.name}"? Os produtos dela ficarão sem categoria.`)) return;
    try {
      await api.deleteCategory(c.id);
      await load();
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao excluir.');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Categorias</h1>
        <button type="button" className="btn-gold" onClick={() => setEditing({ values: { ...blank, sort_order: (items?.length ?? 0) + 1 } })}>Nova categoria</button>
      </div>
      {error && <Notice kind="error">{error}</Notice>}
      {editing && (
        <form onSubmit={save} className="card grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="c-name" className="label">Nome *</label>
            <input id="c-name" className="input" maxLength={80} value={editing.values.name}
              onChange={(e) => setEditing({ ...editing, values: { ...editing.values, name: e.target.value, slug: editing.id ? editing.values.slug : slugify(e.target.value) } })} />
          </div>
          <div>
            <label htmlFor="c-slug" className="label">Slug (URL)</label>
            <input id="c-slug" className="input" value={editing.values.slug} onChange={(e) => setEditing({ ...editing, values: { ...editing.values, slug: slugify(e.target.value) } })} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="c-desc" className="label">Descrição (SEO)</label>
            <input id="c-desc" className="input" maxLength={500} value={editing.values.description ?? ''} onChange={(e) => setEditing({ ...editing, values: { ...editing.values, description: e.target.value } })} />
          </div>
          <div>
            <label htmlFor="c-order" className="label">Ordem</label>
            <input id="c-order" type="number" className="input" value={editing.values.sort_order} onChange={(e) => setEditing({ ...editing, values: { ...editing.values, sort_order: Number(e.target.value) || 0 } })} />
          </div>
          <label className="flex items-center gap-2 self-end pb-3 text-sm"><input type="checkbox" className="h-5 w-5 accent-[#c9a54c]" checked={editing.values.active} onChange={(e) => setEditing({ ...editing, values: { ...editing.values, active: e.target.checked } })} /> Ativa</label>
          <div className="sm:col-span-2">
            <ImageField label="Imagem (opcional)" folder="categories" value={editing.values.image_url ? [editing.values.image_url] : []} onChange={(u) => setEditing({ ...editing, values: { ...editing.values, image_url: u[0] ?? null } })} />
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" className="btn-gold">Salvar</button>
            <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancelar</button>
          </div>
        </form>
      )}
      {!items ? <Spinner /> : (
        <ul className="divide-y divide-white/10 rounded-lg border border-white/10">
          {items.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-3 p-3">
              <span className="w-8 text-center text-xs text-cream/50">{c.sort_order}</span>
              <span className="flex-1">{c.name} <span className="text-xs text-cream/50">/catalogo/{c.slug}</span> {!c.active && <span className="badge bg-white/10">inativa</span>}</span>
              <button type="button" className="btn-outline py-1.5" onClick={() => { const { id, ...values } = c; setEditing({ id, values }); }}>Editar</button>
              <button type="button" className="btn-danger" onClick={() => remove(c)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
