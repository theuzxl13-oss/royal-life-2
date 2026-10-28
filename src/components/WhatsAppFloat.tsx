import { useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { whatsappLink } from '../lib/whatsapp';
import { WhatsAppIcon } from './Icons';

export default function WhatsAppFloat() {
  const { settings } = useStore();
  const { pathname } = useLocation();
  if (pathname.startsWith('/carrinho')) return null;
  return (
    <a
      href={whatsappLink(settings.whatsapp_number, `Olá, ${settings.store_name}! Gostaria de atendimento.`)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Falar conosco pelo WhatsApp"
    >
      <WhatsAppIcon width={30} height={30} />
    </a>
  );
}
