import { useStore } from '../context/StoreContext';

export const emblemUrl = `${import.meta.env.BASE_URL}logo-royal-life.webp`;

/** Emblema oficial + nome. Uma logo enviada no painel (Configurações) substitui o emblema. */
export default function Logo({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  const { settings } = useStore();
  return (
    <span className={`flex items-center gap-2.5 leading-none ${className}`}>
      <img
        src={settings.logo_url || emblemUrl}
        alt=""
        width={44}
        height={44}
        className="h-10 w-10 shrink-0 rounded-full object-contain sm:h-11 sm:w-11"
      />
      <span className="flex flex-col">
        <span className="font-display text-lg font-semibold tracking-[0.2em] text-gold-light sm:text-2xl">ROYAL LIFE</span>
        {!compact && <span className="mt-0.5 text-[0.55rem] tracking-[0.45em] text-cream/80 sm:text-[0.6rem] sm:tracking-[0.5em]">PERFUMARIA</span>}
      </span>
      <span className="sr-only">{settings.store_name}</span>
    </span>
  );
}
