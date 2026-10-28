import { useEffect, useState, type FormEvent } from 'react';
import Notice from '../../components/admin/Notice';
import Spinner from '../../components/Spinner';
import { useStore } from '../../context/StoreContext';
import { slugify } from '../../lib/format';
import { api } from '../../services';
import type { Brand } from '../../types';

export default function Brands() {
  const { refresh } = useStore();
  const [items, setItems] = useState<Brand[] | null>(null);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => api.listBrands().then(setItems).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return setError('Informe o nome da marca.');
    try {
      await api.saveBrand({ name: n, slug: slugify(n) }, editingId ?? undefined);
      setName('');
      setEditingId(null);
      setError(null);
      await load();
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar.');
    }
  };

  const remove = async (b: Brand) => {
    if (!window.confirm(`Excluir a marca "${b.name}"? Os produtos dela ficarão sem marca.`)) return;
    try {
      await api.deleteBrand(b.id);
      await load();
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao excluir.');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-3xl">Marcas</h1>
      <form onSubmit={save} className="card flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <label htmlFor="b-name" className="label">{editingId ? 'Editar marca' : 'Nova marca'}</label>
          <input id="b-name" className="input" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit" className="btn-gold">{editingId ? 'Salvar' : 'Adicionar'}</button>
        {editingId && <button type="button" className="btn-ghost" onClick={() => { setEditingId(null); setName(''); }}>Cancelar</button>}
      </form>
      {error && <Notice kind="error">{error}</Notice>}
      {!items ? <Spinner /> : !items.length ? <p className="text-cream/60">Nenhuma marca cadastrada.</p> : (
        <ul className="divide-y divide-white/10 rounded-lg border border-white/10">
          {items.map((b) => (
            <li key={b.id} className="flex items-center gap-3 p-3">
              <span className="flex-1">{b.name}</span>
              <button type="button" className="btn-outline py-1.5" onClick={() => { setEditingId(b.id); setName(b.name); }}>Editar</button>
              <button type="button" className="btn-danger" onClick={() => remove(b)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
