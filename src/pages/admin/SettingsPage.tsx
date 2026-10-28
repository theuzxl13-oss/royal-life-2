import { useEffect, useState, type FormEvent } from 'react';
import ImageField from '../../components/admin/ImageField';
import Notice from '../../components/admin/Notice';
import Spinner from '../../components/Spinner';
import { useStore } from '../../context/StoreContext';
import { demoMode } from '../../lib/config';
import { normalizePhone, whatsappLink } from '../../lib/whatsapp';
import { api } from '../../services';
import { resetDemoData } from '../../services/demoApi';
import type { Settings } from '../../types';

type Field = { key: keyof Settings; label: string; type?: 'textarea' | 'url' | 'email'; help?: string; max?: number };

const groups: { title: string; fields: Field[] }[] = [
  {
    title: 'Loja e contatos',
    fields: [
      { key: 'store_name', label: 'Nome da loja', max: 80 },
      { key: 'tagline', label: 'Frase de assinatura', max: 120 },
      { key: 'instagram_url', label: 'Instagram (URL)', type: 'url' },
      { key: 'email', label: 'E-mail', type: 'email' },
      { key: 'address', label: 'Endereço', max: 200 },
      { key: 'opening_hours', label: 'Horário de atendimento', max: 200 },
    ],
  },
  {
    title: 'Página inicial',
    fields: [
      { key: 'hero_title', label: 'Título principal (usado quando não há banners)', max: 120 },
      { key: 'hero_subtitle', label: 'Subtítulo principal', max: 300 },
      { key: 'about_title', label: 'Título da seção institucional', max: 120 },
      { key: 'about_text', label: 'Texto institucional / Sobre', type: 'textarea', help: 'Separe parágrafos com uma linha em branco.' },
    ],
  },
  {
    title: 'Políticas',
    fields: [
      { key: 'terms_text', label: 'Condições de compra', type: 'textarea', help: 'Vazio = texto-base. Use "## " no início da linha para títulos e "- " para listas.' },
      { key: 'privacy_text', label: 'Política de privacidade', type: 'textarea', help: 'Vazio = texto-base.' },
    ],
  },
];

export default function SettingsPage() {
  const { settings, refresh, loading } = useStore();
  const [values, setValues] = useState<Settings>(settings);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  // Carrega os valores uma vez, quando os dados chegam (não sobrescreve o que está sendo digitado).
  useEffect(() => {
    if (!loading) setValues(settings);
  }, [loading]);

  const set = (key: keyof Settings, v: string) => setValues((prev) => ({ ...prev, [key]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const phone = normalizePhone(values.whatsapp_number);
    if (phone && (phone.length < 10 || phone.length > 15)) {
      setMsg({ kind: 'error', text: 'WhatsApp: use o formato internacional com DDI e DDD, ex.: 5511999998888.' });
      return;
    }
    if (values.instagram_url && !/^https:\/\//.test(values.instagram_url)) {
      setMsg({ kind: 'error', text: 'O link do Instagram deve começar com https://' });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const saved = await api.updateSettings({ ...values, whatsapp_number: phone });
      setValues(saved);
      await refresh();
      setMsg({ kind: 'success', text: 'Configurações salvas. O site já reflete as alterações.' });
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof Error ? err.message : 'Falha ao salvar.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6" noValidate>
      <h1 className="font-display text-3xl">Configurações</h1>

      <section className="card space-y-4" aria-labelledby="wa-title">
        <h2 id="wa-title" className="font-display text-xl text-gold-light">WhatsApp oficial</h2>
        <div>
          <label htmlFor="whatsapp_number" className="label">Número (com DDI e DDD, só números)</label>
          <input id="whatsapp_number" className="input" inputMode="tel" placeholder="5511999998888" value={values.whatsapp_number} onChange={(e) => set('whatsapp_number', e.target.value)} />
          <p className="mt-1 text-xs text-cream/50">Todos os pedidos e botões "Comprar pelo WhatsApp" usam este número. Vazio: o WhatsApp abre para o cliente escolher o contato.</p>
        </div>
        {normalizePhone(values.whatsapp_number) && (
          <a className="text-sm text-gold underline" href={whatsappLink(values.whatsapp_number, 'Teste de configuração do catálogo.')} target="_blank" rel="noopener noreferrer">Testar link do WhatsApp</a>
        )}
      </section>

      <section className="card">
        <ImageField label="Logo oficial (PNG/WebP com fundo transparente)" folder="brand" value={values.logo_url ? [values.logo_url] : []} onChange={(u) => set('logo_url', u[0] ?? '')} />
      </section>

      {groups.map((g) => (
        <section key={g.title} className="card space-y-4">
          <h2 className="font-display text-xl text-gold-light">{g.title}</h2>
          {g.fields.map((f) => (
            <div key={f.key}>
              <label htmlFor={f.key} className="label">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea id={f.key} className="input min-h-[160px]" maxLength={10000} value={values[f.key]} onChange={(e) => set(f.key, e.target.value)} />
              ) : (
                <input id={f.key} type={f.type ?? 'text'} className="input" maxLength={f.max ?? 300} value={values[f.key]} onChange={(e) => set(f.key, e.target.value)} />
              )}
              {f.help && <p className="mt-1 text-xs text-cream/50">{f.help}</p>}
            </div>
          ))}
        </section>
      ))}

      {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
      <button type="submit" className="btn-gold" disabled={saving}>{saving ? 'Salvando…' : 'Salvar configurações'}</button>

      {demoMode && (
        <section className="card mt-10 space-y-3 border-cream/20">
          <h2 className="font-display text-xl">Demonstração</h2>
          <p className="text-sm text-cream/70">Restaura os dados ilustrativos originais neste navegador.</p>
          <button type="button" className="btn-danger" onClick={() => { if (window.confirm('Restaurar dados de demonstração?')) { resetDemoData(); refresh(); } }}>
            Restaurar dados de demonstração
          </button>
        </section>
      )}
    </form>
  );
}
