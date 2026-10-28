import type { OrderItem, Product } from '../types';
import { effectivePrice, formatPrice } from './format';

/** Mantém só dígitos. Número no formato internacional, ex.: 5511999999999. */
export const normalizePhone = (raw: string) => raw.replace(/\D/g, '');

/**
 * Monta o link wa.me. Sem número configurado, o WhatsApp abre e o
 * cliente escolhe o contato — o botão continua funcional.
 */
export function whatsappLink(number: string, message: string) {
  const phone = normalizePhone(number);
  const text = encodeURIComponent(message);
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function productInquiryMessage(product: Product, brandName: string | undefined, quantity: number, url: string) {
  const lines = [
    'Olá! Tenho interesse neste produto:',
    '',
    `*${product.name}*${brandName ? ` — ${brandName}` : ''}`,
    product.volume ? `Volume: ${product.volume}` : null,
    `Quantidade: ${quantity}`,
    `Preço unitário: ${formatPrice(effectivePrice(product))}`,
    '',
    url,
    '',
    'Poderia confirmar a disponibilidade?',
  ];
  return lines.filter((l) => l !== null).join('\n');
}

export function orderMessage(params: {
  storeName: string;
  code?: string;
  customerName: string;
  notes?: string;
  items: Pick<OrderItem, 'name' | 'volume' | 'quantity' | 'unit_price' | 'subtotal'>[];
  total: number;
}) {
  const { storeName, code, customerName, notes, items, total } = params;
  const lines: string[] = [`Olá, ${storeName}! Gostaria de fazer um pedido.`, ''];
  if (code) lines.push(`*Pedido:* ${code}`);
  lines.push(`*Nome:* ${customerName}`, '', '*Itens:*');
  items.forEach((item, i) => {
    const vol = item.volume ? ` (${item.volume})` : '';
    lines.push(`${i + 1}. ${item.name}${vol}`);
    lines.push(`   ${item.quantity} x ${formatPrice(item.unit_price)} = ${formatPrice(item.subtotal)}`);
  });
  lines.push('', `*Total:* ${formatPrice(total)}`);
  if (notes && notes.trim()) lines.push('', `*Observações:* ${notes.trim()}`);
  lines.push('', 'Aguardo a confirmação do pedido, disponibilidade e forma de pagamento/entrega.');
  return lines.join('\n');
}
