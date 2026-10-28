import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { MinusIcon, PlusIcon, TrashIcon, WhatsAppIcon } from '../components/Icons';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../hooks/useSeo';
import { formatPrice } from '../lib/format';
import { orderMessage, whatsappLink } from '../lib/whatsapp';
import { api } from '../services';

export default function Cart() {
  const { items, total, setQuantity, remove, clear } = useCart();
  const { settings, brandName, refresh } = useStore();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ code: string; link: string } | null>(null);
  useSeo({ title: 'Carrinho', noindex: true });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      setError('Informe seu nome para enviarmos o pedido.');
      return;
    }
    if (notes.length > 1000) {
      setError('As observações devem ter no máximo 1000 caracteres.');
      return;
    }
    // Abre a janela já no clique (evita bloqueio de pop-up) e depois define o link.
    const win = window.open('', '_blank');
    setSending(true);
    try {
      const order = await api.createOrder(cleanName, notes, items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
      const message = orderMessage({ storeName: settings.store_name, code: order.code, customerName: cleanName, notes, items: order.items, total: order.total });
      const link = whatsappLink(settings.whatsapp_number, message);
      if (win) win.location.href = link;
      else window.location.href = link;
      setSent({ code: order.code, link });
      clear();
    } catch (err) {
      win?.close();
      setError(err instanceof Error ? err.message : 'Não foi possível registrar o pedido. Tente novamente.');
      refresh();
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="container-page max-w-xl py-20 text-center">
        <p className="eyebrow">Pedido {sent.code}</p>
        <h1 className="section-title mt-3">Pedido enviado para atendimento</h1>
        <p className="mt-4 text-cream/80">
          Seu pedido foi registrado e a conversa no WhatsApp foi aberta com os itens. <strong>Envie a mensagem</strong> para que nossa equipe confirme a
          disponibilidade, o valor final, a forma de pagamento e a entrega. Nenhum pagamento foi realizado pelo site.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href={sent.link} target="_blank" rel="noopener noreferrer" className="btn-whatsapp"><WhatsAppIcon /> Abrir WhatsApp novamente</a>
          <Link to="/catalogo" className="btn-outline">Continuar navegando</Link>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="section-title">Seu carrinho está vazio</h1>
        <p className="mt-3 text-cream/70">Explore o catálogo e escolha suas fragrâncias.</p>
        <Link to="/catalogo" className="btn-gold mt-8">Explorar catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="section-title">Carrinho</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-white/10 rounded-lg border border-white/10" aria-label="Itens do carrinho">
          {items.map((item) => {
            const p = item.product;
            return (
              <li key={item.productId} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                <Link to={`/produto/${p.slug}`} className="h-24 w-20 shrink-0 overflow-hidden rounded bg-ink-700 sm:h-28 sm:w-24">
                  {p.images[0] && <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={96} height={112} />}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {brandName(p.brand_id) && <p className="text-[0.7rem] uppercase tracking-[0.15em] text-gold">{brandName(p.brand_id)}</p>}
                      <Link to={`/produto/${p.slug}`} className="block font-display text-lg leading-tight hover:text-gold-light">{p.name}</Link>
                      {p.volume && <p className="text-xs text-cream/60">{p.volume}</p>}
                    </div>
                    <button type="button" className="icon-btn h-10 w-10 shrink-0 text-cream/60 hover:text-red-300" onClick={() => remove(item.productId)} aria-label={`Remover ${p.name} do carrinho`}>
                      <TrashIcon width={18} height={18} />
                    </button>
                  </div>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-2">
                    <div className="flex items-center rounded border border-white/15" role="group" aria-label={`Quantidade de ${p.name}`}>
                      <button type="button" className="icon-btn h-10 w-10 rounded-none" onClick={() => setQuantity(item.productId, item.quantity - 1)} aria-label="Diminuir quantidade">
                        <MinusIcon width={16} height={16} />
                      </button>
                      <span className="w-8 text-center text-sm" aria-live="polite">{item.quantity}</span>
                      <button type="button" className="icon-btn h-10 w-10 rounded-none" onClick={() => setQuantity(item.productId, item.quantity + 1)} disabled={item.quantity >= p.stock} aria-label="Aumentar quantidade">
                        <PlusIcon width={16} height={16} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-cream/60">{item.quantity} x {formatPrice(item.unitPrice)}</p>
                      <p className="font-semibold text-gold-light">{formatPrice(item.subtotal)}</p>
                    </div>
                  </div>
                  {item.quantity >= p.stock && <p className="mt-1 text-xs text-cream/60">Quantidade máxima disponível em estoque.</p>}
                </div>
              </li>
            );
          })}
        </ul>

        <form onSubmit={submit} className="card h-fit space-y-5 lg:sticky lg:top-24" noValidate>
          <h2 className="font-display text-2xl">Resumo</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-cream/70">Subtotal</dt><dd>{formatPrice(total)}</dd></div>
            <div className="flex justify-between text-cream/60"><dt>Entrega</dt><dd>a combinar</dd></div>
            <div className="flex justify-between border-t border-white/10 pt-3 text-lg"><dt>Total</dt><dd className="font-semibold text-gold-light">{formatPrice(total)}</dd></div>
          </dl>
          <div>
            <label htmlFor="c-name" className="label">Seu nome *</label>
            <input id="c-name" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required maxLength={120} aria-invalid={Boolean(error && name.trim().length < 2)} />
          </div>
          <div>
            <label htmlFor="c-notes" className="label">Observações</label>
            <textarea id="c-notes" className="input min-h-[96px]" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} placeholder="Ex.: bairro para entrega, horário, embalagem para presente" />
          </div>
          {error && <p role="alert" className="rounded border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          <button type="submit" className="btn-whatsapp w-full" disabled={sending}>
            <WhatsAppIcon /> {sending ? 'Registrando pedido…' : 'Enviar pedido pelo WhatsApp'}
          </button>
          <p className="text-xs leading-relaxed text-cream/60">
            O pagamento não é feito pelo site. Ao enviar, abriremos o WhatsApp com a lista de itens; nossa equipe confirma disponibilidade, valores, pagamento e entrega.
            Veja as <Link to="/condicoes-de-compra" className="underline hover:text-gold-light">condições de compra</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
