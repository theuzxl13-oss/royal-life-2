import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DemoNotice from './DemoNotice';
import Footer from './Footer';
import Header from './Header';
import WhatsAppFloat from './WhatsAppFloat';

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <DemoNotice />
      <Header />
      <main id="conteudo" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
