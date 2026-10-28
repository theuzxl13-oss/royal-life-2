import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { hasPromo, isIllustration } from '../lib/format';
import type { Product } from '../types';
import Price from './Price';

export default function ProductCard({ product }: { product: Product }) {
  const { brandName } = useStore();
  const { add } = useCart();
  const brand = brandName(product.brand_id);
  const out = product.stock <= 0;
  const img = product.images[0];

  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-paper text-ink-700">
      <Link to={`/produto/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-paper" aria-label={`Ver detalhes de ${product.name}`}>
        {img ? (
          <img
            src={img}
            alt={`${isIllustration(img) ? 'Imagem ilustrativa de ' : ''}${product.name}${brand ? ` — ${brand}` : ''}`}
            loading="lazy"
            decoding="async"
            width={400}
            height={500}
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${out ? 'opacity-50' : ''}`}
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-steel">Sem foto</span>
        )}
        <span className="absolute left-3 top-3 flex flex-col items-start gap-1">
          {product.demo && <span className="badge bg-cream-dark text-ink-700">Demonstração</span>}
          {product.is_new && <span className="badge bg-[#fff3e6] text-[#b64400]">Lançamento</span>}
          {hasPromo(product) && <span className="badge bg-gold text-ink">Oferta</span>}
          {out && <span className="badge bg-ink-700 text-cream">Esgotado</span>}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-1 px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
        {brand && <p className="text-xs text-graphite">{brand}</p>}
        <h3 className="font-display text-[17px] font-semibold leading-tight sm:text-[19px]">
          <Link to={`/produto/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        {product.volume && <p className="text-xs text-graphite">{product.volume}</p>}
        <div className="mt-auto pt-2">
          <Price price={product.price} promo={product.promo_price} tone="light" />
        </div>
        <button
          type="button"
          onClick={() => add(product.id)}
          disabled={out}
          className="btn-gold mt-3 min-h-[40px] w-full px-3 py-2 text-[13px] disabled:bg-cream-dark disabled:text-graphite disabled:opacity-100"
          aria-label={out ? `${product.name} esgotado` : `Adicionar ${product.name} ao carrinho`}
        >
          {out ? 'Esgotado' : <span>Adicionar<span className="hidden sm:inline"> ao carrinho</span></span>}
        </button>
      </div>
    </article>
  );
}
