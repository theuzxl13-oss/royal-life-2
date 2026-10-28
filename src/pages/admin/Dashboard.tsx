import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services';
import type { Order, Product } from '../../types';

export default function Dashboard() {
  const { settings } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.listProducts(true), api.listOrders()])
      .then(([p, o]) => {
        setProducts(p);
        setOrders(o);
      })
      .catch((e) => setError(e.message));
  }, []);

  const stats = [
    { label: 'Produtos ativos', value: products.filter((p) => p.active).length, to: '/admin/produtos' },
    { label: 'Sem estoque', value: products.filter((p) => p.active && p.stock <= 0).length, to: '/admin/produtos?estoque=0' },
    { label: 'Pedidos novos', value: orders.filter((o) => o.status === 'novo').length, to: '/admin/pedidos' },
    { label: 'Pedidos no total', value: orders.length, to: '/admin/pedidos' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl">Painel</h1>
      {error && <p className="text-red-300">{error}</p>}
      {!settings.whatsapp_number && (
        <p className="rounded border border-gold/40 bg-gold/10 p-3 text-sm text-gold-light">
          O número oficial de WhatsApp ainda não foi configurado. <Link to="/admin/configuracoes" className="underline">Configurar agora</Link>.
        </p>
      )}
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link to={s.to} className="card block hover:border-gold/40">
              <p className="text-3xl font-semibold text-gold-light">{s.value}</p>
              <p className="mt-1 text-sm text-cream/70">{s.label}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3">
        <Link to="/admin/produtos/novo" className="btn-gold">Cadastrar produto</Link>
        <Link to="/admin/pedidos" className="btn-outline">Ver pedidos</Link>
      </div>
    </div>
  );
}
