import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

export default function NotFound({ message = 'A página que você procura não existe ou foi movida.' }: { message?: string }) {
  useSeo({ title: 'Página não encontrada', noindex: true });
  return (
    <div className="container-page py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="section-title mt-3">Não encontrado</h1>
      <p className="mx-auto mt-4 max-w-md text-cream/75">{message}</p>
      <Link to="/catalogo" className="btn-gold mt-8">Explorar catálogo</Link>
    </div>
  );
}
