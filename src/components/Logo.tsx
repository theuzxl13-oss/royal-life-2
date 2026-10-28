import { useStore } from '../context/StoreContext';

/** Usa a logo oficial enviada no painel; sem ela, exibe a marca tipográfica. */
export default function Logo({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  const { settings } = useStore();
  if (settings.logo_url) {
    return <img src={settings.logo_url} alt={settings.store_name} className={`h-11 w-auto object-contain ${className}`} width={160} height={44} />;
  }
  return (
    <span className={`flex items-center gap-2 leading-none ${className}`}>
      <svg viewBox="0 0 64 40" className="h-7 w-10 shrink-0" aria-hidden>
        <defs>
          <linearGradient id="logo-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9c7c2e" />
            <stop offset=".5" stopColor="#e6cf8b" />
            <stop offset="1" stopColor="#9c7c2e" />
          </linearGradient>
        </defs>
        <path d="M6 32h52L54 8 42 18 32 2 22 18 10 8z" fill="url(#logo-gold)" />
        <rect x="6" y="34" width="52" height="4" rx="1" fill="url(#logo-gold)" />
      </svg>
      <span className="flex flex-col">
        <span className="font-display text-xl font-semibold tracking-[0.2em] text-gold-light sm:text-2xl">ROYAL LIFE</span>
        {!compact && <span className="mt-0.5 text-[0.6rem] tracking-[0.5em] text-cream/80">PERFUMARIA</span>}
      </span>
      <span className="sr-only">{settings.store_name}</span>
    </span>
  );
}
