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
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-white/5 bg-ink-800 transition hover:border-gold/40">
      <Link to={`/produto/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-ink-700" aria-label={`Ver detalhes de ${product.name}`}>
        {img ? (
          <img
            src={img}
            alt={`${isIllustration(img) ? 'Imagem ilustrativa de ' : ''}${product.name}${brand ? ` — ${brand}` : ''}`}
            loading="lazy"
            decoding="async"
            width={400}
            height={500}
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${out ? 'opacity-50' : ''}`}
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-cream/40">Sem foto</span>
        )}
        <span className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {product.demo && <span className="badge bg-cream text-ink">Demonstração</span>}
          {product.is_new && <span className="badge bg-ink/80 text-gold-light ring-1 ring-gold/50">Lançamento</span>}
          {hasPromo(product) && <span className="badge bg-gold text-ink">Oferta</span>}
          {out && <span className="badge bg-ink/90 text-cream ring-1 ring-white/20">Esgotado</span>}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        {brand && <p className="text-[0.7rem] uppercase tracking-[0.18em] text-gold">{brand}</p>}
        <h3 className="font-display text-lg leading-tight text-cream">
          <Link to={`/produto/${product.slug}`} className="hover:text-gold-light">
            {product.name}
          </Link>
        </h3>
        {product.volume && <p className="text-xs text-cream/60">{product.volume}</p>}
        <div className="mt-auto pt-2">
          <Price price={product.price} promo={product.promo_price} />
        </div>
        <button
          type="button"
          onClick={() => add(product.id)}
          disabled={out}
          className="btn-outline mt-2 w-full px-2 py-2 text-xs tracking-[0.08em]"
          aria-label={out ? `${product.name} esgotado` : `Adicionar ${product.name} ao carrinho`}
        >
          {out ? 'Esgotado' : <span>Adicionar<span className="hidden sm:inline"> ao carrinho</span></span>}
        </button>
      </div>
    </article>
  );
}
