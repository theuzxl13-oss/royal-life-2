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
        className="h-9 w-9 shrink-0 rounded-full object-contain sm:h-10 sm:w-10"
      />
      <span className="flex flex-col">
        <span className="text-[15px] font-semibold tracking-[0.18em] text-cream sm:text-[17px]">ROYAL LIFE</span>
        {!compact && <span className="mt-1 text-[0.55rem] tracking-[0.42em] text-gold sm:text-[0.6rem]">PERFUMARIA</span>}
      </span>
      <span className="sr-only">{settings.store_name}</span>
    </span>
  );
}
