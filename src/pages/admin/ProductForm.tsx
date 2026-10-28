import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ImageField from '../../components/admin/ImageField';
import Notice from '../../components/admin/Notice';
import Spinner from '../../components/Spinner';
import { useStore } from '../../context/StoreContext';
import { slugify } from '../../lib/format';
import { api } from '../../services';
import { parseMoney, validateProduct } from '../../lib/validation';
import type { Brand, Category, ProductInput } from '../../types';

const empty: ProductInput = {
  name: '',
  slug: '',
  brand_id: null,
  category_id: null,
  volume: '',
  short_description: '',
  description: '',
  details: '',
  price: 0,
  promo_price: null,
  stock: 0,
  images: [],
  featured: false,
  is_new: false,
  active: true,
};

const moneyStr = (n: number | null) => (n == null ? '' : n.toFixed(2).replace('.', ','));

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refresh } = useStore();
  const [values, setValues] = useState<ProductInput>(empty);
  const [price, setPrice] = useState('');
  const [promo, setPromo] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listCategories(true).then(setCategories).catch(() => undefined);
    api.listBrands().then(setBrands).catch(() => undefined);
    if (!id) return;
    api
      .getProduct(id)
      .then((p) => {
        if (!p) {
          setError('Produto não encontrado.');
          return;
        }
        const { id: _id, created_at, demo, ...rest } = p;
        void _id; void created_at; void demo;
        setValues(rest);
        setPrice(moneyStr(p.price));
        setPromo(moneyStr(p.promo_price));
        setSlugTouched(true);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const set = <K extends keyof ProductInput>(key: K, v: ProductInput[K]) => setValues((prev) => ({ ...prev, [key]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: ProductInput = {
      ...values,
      name: values.name.trim(),
      price: parseMoney(price),
      promo_price: promo.trim() ? parseMoney(promo) : null,
      volume: values.volume?.trim() || null,
      short_description: values.short_description?.trim() || null,
      description: values.description?.trim() || null,
      details: values.details?.trim() || null,
    };
    const invalid = validateProduct(payload);
    if (invalid) {
      setError(invalid);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.saveProduct(payload, id);
      await refresh();
      navigate('/admin/produtos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">{id ? 'Editar produto' : 'Novo produto'}</h1>
        <Link to="/admin/produtos" className="btn-ghost">← Voltar</Link>
      </div>

      <div className="card grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="label">Nome *</label>
          <input id="name" className="input" required maxLength={140} value={values.name}
            onChange={(e) => {
              set('name', e.target.value);
              if (!slugTouched) set('slug', slugify(e.target.value));
            }} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="slug" className="label">Endereço na URL (slug) *</label>
          <input id="slug" className="input" value={values.slug} onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} />
          <p className="mt-1 text-xs text-cream/50">/produto/{values.slug || '…'}</p>
        </div>
        <div>
          <label htmlFor="brand" className="label">Marca</label>
          <select id="brand" className="input" value={values.brand_id ?? ''} onChange={(e) => set('brand_id', e.target.value || null)}>
            <option value="">— sem marca —</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <Link to="/admin/marcas" className="mt-1 inline-block text-xs text-gold hover:underline">Gerenciar marcas</Link>
        </div>
        <div>
          <label htmlFor="category" className="label">Categoria</label>
          <select id="category" className="input" value={values.category_id ?? ''} onChange={(e) => set('category_id', e.target.value || null)}>
            <option value="">— sem categoria —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}{c.active ? '' : ' (inativa)'}</option>)}
          </select>
          <Link to="/admin/categorias" className="mt-1 inline-block text-xs text-gold hover:underline">Gerenciar categorias</Link>
        </div>
        <div>
          <label htmlFor="volume" className="label">Volume</label>
          <input id="volume" className="input" placeholder="Ex.: 100 ml" maxLength={40} value={values.volume ?? ''} onChange={(e) => set('volume', e.target.value)} />
        </div>
        <div>
          <label htmlFor="stock" className="label">Estoque *</label>
          <input id="stock" type="number" min={0} step={1} inputMode="numeric" className="input" value={values.stock}
            onChange={(e) => set('stock', Math.max(0, Math.floor(Number(e.target.value) || 0)))} />
        </div>
        <div>
          <label htmlFor="price" className="label">Preço (R$) *</label>
          <input id="price" inputMode="decimal" className="input" placeholder="0,00" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label htmlFor="promo" className="label">Preço promocional (opcional)</label>
          <input id="promo" inputMode="decimal" className="input" placeholder="vazio = sem promoção" value={promo} onChange={(e) => setPromo(e.target.value)} />
        </div>
      </div>

      <div className="card space-y-5">
        <div>
          <label htmlFor="short" className="label">Resumo (aparece no topo da página do produto)</label>
          <textarea id="short" className="input min-h-[70px]" maxLength={300} value={values.short_description ?? ''} onChange={(e) => set('short_description', e.target.value)} />
        </div>
        <div>
          <label htmlFor="desc" className="label">Descrição</label>
          <textarea id="desc" className="input min-h-[140px]" maxLength={5000} value={values.description ?? ''} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div>
          <label htmlFor="details" className="label">Detalhes (notas olfativas, modo de uso…)</label>
          <textarea id="details" className="input min-h-[110px]" maxLength={5000} value={values.details ?? ''} onChange={(e) => set('details', e.target.value)} />
        </div>
        <p className="text-xs text-cream/50">Informe apenas dados confirmados. Não declare originalidade, certificações ou procedência sem comprovação.</p>
      </div>

      <div className="card">
        <ImageField label="Fotos (a primeira é a capa)" folder="products" multiple value={values.images} onChange={(urls) => set('images', urls)} />
      </div>

      <div className="card flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-[#c9a54c]" checked={values.active} onChange={(e) => set('active', e.target.checked)} /> Ativo (visível no catálogo)</label>
        <label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-[#c9a54c]" checked={values.featured} onChange={(e) => set('featured', e.target.checked)} /> Destaque na página inicial</label>
        <label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-[#c9a54c]" checked={values.is_new} onChange={(e) => set('is_new', e.target.checked)} /> Lançamento</label>
      </div>

      {error && <Notice kind="error">{error}</Notice>}
      <div className="flex gap-3">
        <button type="submit" className="btn-gold" disabled={saving}>{saving ? 'Salvando…' : 'Salvar produto'}</button>
        <Link to="/admin/produtos" className="btn-ghost">Cancelar</Link>
      </div>
    </form>
  );
}
