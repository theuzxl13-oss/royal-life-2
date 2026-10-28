import { useEffect, useState } from 'react';
import Notice from '../../components/admin/Notice';
import Spinner from '../../components/Spinner';
import { formatDate, formatPrice } from '../../lib/format';
import { api } from '../../services';
import type { Order, OrderStatus } from '../../types';

export const statusLabels: Record<OrderStatus, string> = {
  novo: 'Novo',
  em_atendimento: 'Em atendimento',
  confirmado: 'Confirmado',
  enviado: 'Enviado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

const statusColor: Record<OrderStatus, string> = {
  novo: 'bg-gold text-ink',
  em_atendimento: 'bg-sky-500/20 text-sky-200',
  confirmado: 'bg-emerald-500/20 text-emerald-200',
  enviado: 'bg-indigo-500/20 text-indigo-200',
  concluido: 'bg-white/10 text-cream/80',
  cancelado: 'bg-red-500/20 text-red-200',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filter, setFilter] = useState<OrderStatus | ''>('');
  const [error, setError] = useState<string | null>(null);

  const load = () => api.listOrders().then(setOrders).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const update = async (o: Order, status: OrderStatus) => {
    try {
      await api.updateOrderStatus(o.id, status);
      setOrders((prev) => prev?.map((x) => (x.id === o.id ? { ...x, status } : x)) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao atualizar.');
    }
  };

  const list = (orders ?? []).filter((o) => !filter || o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Pedidos</h1>
        <div className="flex gap-2">
          <label htmlFor="o-filter" className="sr-only">Filtrar por status</label>
          <select id="o-filter" className="input w-48" value={filter} onChange={(e) => setFilter(e.target.value as OrderStatus | '')}>
            <option value="">Todos os status</option>
            {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button type="button" className="btn-outline" onClick={load}>Atualizar</button>
        </div>
      </div>
      <p className="text-sm text-cream/60">Pedidos registrados quando o cliente envia o carrinho pelo WhatsApp. O estoque não é baixado automaticamente: ajuste-o no produto após confirmar a venda.</p>
      {error && <Notice kind="error">{error}</Notice>}
      {!orders ? <Spinner /> : !list.length ? <p className="card text-cream/60">Nenhum pedido.</p> : (
        <ul className="space-y-3">
          {list.map((o) => (
            <li key={o.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm text-gold-light">{o.code}</span>
                <span className={`badge ${statusColor[o.status]}`}>{statusLabels[o.status]}</span>
                <span className="text-sm text-cream/60">{formatDate(o.created_at)}</span>
                <span className="ml-auto font-semibold">{formatPrice(o.total)}</span>
              </div>
              <p className="mt-2"><span className="text-cream/60">Cliente:</span> {o.customer_name}</p>
              {o.notes && <p className="mt-1 text-sm"><span className="text-cream/60">Observações:</span> {o.notes}</p>}
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gold">{o.items.length} {o.items.length === 1 ? 'item' : 'itens'}</summary>
                <ul className="mt-2 space-y-1 text-sm text-cream/85">
                  {o.items.map((i, k) => (
                    <li key={k}>{i.quantity} × {i.name}{i.volume ? ` (${i.volume})` : ''} — {formatPrice(i.unit_price)} = {formatPrice(i.subtotal)}</li>
                  ))}
                </ul>
              </details>
              <div className="mt-3 flex items-center gap-2">
                <label htmlFor={`st-${o.id}`} className="text-sm text-cream/60">Status:</label>
                <select id={`st-${o.id}`} className="input w-48" value={o.status} onChange={(e) => update(o, e.target.value as OrderStatus)}>
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
