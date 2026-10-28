import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { isSafeHttps } from '../lib/format';
import { whatsappLink } from '../lib/whatsapp';
import { ClockIcon, InstagramIcon, MailIcon, PinIcon, WhatsAppIcon } from './Icons';
import Logo from './Logo';

export default function Footer() {
  const { settings, categories } = useStore();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-white/10 bg-ink-800">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 font-display text-[19px] font-semibold text-cream">{settings.tagline}</p>
        </div>
        <div>
          <h2 className="footer-title">Categorias</h2>
          <ul className="space-y-2.5">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/catalogo/${c.slug}`} className="footer-link">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer-title">Atendimento</h2>
          <ul className="space-y-2.5">
            <li>
              <a href={whatsappLink(settings.whatsapp_number, `Olá, ${settings.store_name}!`)} target="_blank" rel="noopener noreferrer" className="footer-link inline-flex items-center gap-2">
                <WhatsAppIcon width={16} height={16} /> WhatsApp{settings.whatsapp_number ? '' : ' (número a configurar)'}
              </a>
            </li>
            {isSafeHttps(settings.instagram_url) && (
              <li>
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="footer-link inline-flex items-center gap-2">
                  <InstagramIcon width={16} height={16} /> Instagram
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="footer-link inline-flex items-center gap-2 break-all">
                  <MailIcon width={16} height={16} /> {settings.email}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-2 text-xs text-steel"><PinIcon width={16} height={16} className="mt-0.5 shrink-0" /> {settings.address}</li>
            )}
            {settings.opening_hours && (
              <li className="flex items-start gap-2 text-xs text-steel"><ClockIcon width={16} height={16} className="mt-0.5 shrink-0" /> {settings.opening_hours}</li>
            )}
          </ul>
        </div>
        <div>
          <h2 className="footer-title">Políticas</h2>
          <ul className="space-y-2.5">
            <li><Link to="/condicoes-de-compra" className="footer-link">Condições de compra</Link></li>
            <li><Link to="/privacidade" className="footer-link">Política de privacidade</Link></li>
            <li><Link to="/sobre" className="footer-link">Sobre nós</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-page border-t border-white/10 py-5 text-xs text-steel">
        © {year} {settings.store_name}. Todos os direitos reservados. ·{' '}
        <Link to="/admin" className="hover:text-cream">Área restrita</Link>
      </div>
    </footer>
  );
}
