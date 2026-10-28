import { useRef, useState } from 'react';
import { api } from '../../services';
import { ChevronLeft, ChevronRight, TrashIcon } from '../Icons';

interface Props {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  folder: string;
  multiple?: boolean;
  max?: number;
}

/** Envio (com otimização), remoção, reordenação e inclusão por URL de imagens. */
export default function ImageField({ label, value, onChange, folder, multiple = false, max = 8 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState('');

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    setBusy(true);
    try {
      const room = multiple ? max - value.length : 1;
      const list = Array.from(files).slice(0, Math.max(0, room));
      const urls: string[] = [];
      for (const f of list) urls.push(await api.uploadImage(f, folder));
      onChange(multiple ? [...value, ...urls] : urls.slice(0, 1));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha no envio.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const addUrl = () => {
    const u = url.trim();
    if (!/^https:\/\/\S+$/.test(u)) {
      setError('Informe uma URL https válida.');
      return;
    }
    onChange(multiple ? [...value, u].slice(0, max) : [u]);
    setUrl('');
    setError(null);
  };

  const move = (i: number, d: number) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <fieldset>
      <legend className="label">{label}</legend>
      {value.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-3">
          {value.map((src, i) => (
            <li key={src + i} className="relative w-24">
              <img src={src} alt={`Imagem ${i + 1}`} className="h-28 w-24 rounded border border-white/10 object-cover" />
              {multiple && i === 0 && <span className="badge absolute left-1 top-1 bg-gold text-ink">Capa</span>}
              <div className="mt-1 flex justify-between">
                {multiple && (
                  <>
                    <button type="button" className="rounded p-1 hover:bg-white/10 disabled:opacity-30" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Mover imagem ${i + 1} para a esquerda`}><ChevronLeft width={16} height={16} /></button>
                    <button type="button" className="rounded p-1 hover:bg-white/10 disabled:opacity-30" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label={`Mover imagem ${i + 1} para a direita`}><ChevronRight width={16} height={16} /></button>
                  </>
                )}
                <button type="button" className="rounded p-1 text-red-300 hover:bg-red-500/10" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label={`Remover imagem ${i + 1}`}><TrashIcon width={16} height={16} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple={multiple} className="sr-only" id={`file-${folder}-${label}`} onChange={(e) => upload(e.target.files)} />
        <label htmlFor={`file-${folder}-${label}`} className={`btn-outline cursor-pointer ${busy || (multiple && value.length >= max) ? 'pointer-events-none opacity-50' : ''}`}>
          {busy ? 'Enviando…' : value.length && !multiple ? 'Trocar imagem' : 'Enviar imagem'}
        </label>
        <div className="flex min-w-[220px] flex-1 gap-2">
          <label className="sr-only" htmlFor={`url-${folder}-${label}`}>URL da imagem</label>
          <input id={`url-${folder}-${label}`} className="input" placeholder="ou cole uma URL https://" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="button" className="btn-ghost border border-white/10" onClick={addUrl}>Adicionar</button>
        </div>
      </div>
      <p className="mt-1 text-xs text-cream/50">JPG, PNG ou WebP. As imagens são redimensionadas e convertidas para WebP automaticamente.</p>
      {error && <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>}
    </fieldset>
  );
}
