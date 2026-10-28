import { formatPrice, hasPromo } from '../lib/format';

/** `tone="light"`: preço sobre cartão branco. */
export default function Price({ price, promo, large = false, tone = 'dark' }: { price: number; promo: number | null; large?: boolean; tone?: 'dark' | 'light' }) {
  const promoOn = hasPromo({ price, promo_price: promo });
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      {promoOn && (
        <span className={`text-steel line-through ${large ? 'text-base' : 'text-xs'}`}>
          <span className="sr-only">De </span>
          {formatPrice(price)}
        </span>
      )}
      <span className={`font-semibold ${tone === 'light' ? 'text-ink-700' : 'text-cream'} ${large ? 'font-display text-[28px] sm:text-[32px]' : 'text-[15px]'}`}>
        {promoOn && <span className="sr-only">Por </span>}
        {formatPrice(promoOn ? promo! : price)}
      </span>
    </div>
  );
}
