import { formatPrice, hasPromo } from '../lib/format';

export default function Price({ price, promo, large = false }: { price: number; promo: number | null; large?: boolean }) {
  const promoOn = hasPromo({ price, promo_price: promo });
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      {promoOn && (
        <span className={`text-cream/60 line-through ${large ? 'text-base' : 'text-xs'}`}>
          <span className="sr-only">De </span>
          {formatPrice(price)}
        </span>
      )}
      <span className={`font-semibold text-gold-light ${large ? 'text-3xl' : 'text-base'}`}>
        {promoOn && <span className="sr-only">Por </span>}
        {formatPrice(promoOn ? promo! : price)}
      </span>
    </div>
  );
}
