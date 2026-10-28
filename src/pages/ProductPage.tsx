import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MinusIcon, PlusIcon, WhatsAppIcon } from '../components/Icons';
import Price from '../components/Price';
import ProductGrid from '../components/ProductGrid';
import Spinner from '../components/Spinner';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../hooks/useSeo';
import { siteUrl } from '../lib/config';
import { effectivePrice } from '../lib/format';
import { productInquiryMessage, whatsappLink } from '../lib/whatsapp';
import NotFound from './NotFound';

export default function ProductPage() {
  const { slug } = useParams();
  const { products, loading, brandName, categoryById, settings } = useStore();
  const { add, lines } = useCart();
  const product = products.find((p) => p.slug === slug);
  const [imgIndex, setImgIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setImgIndex(0);
    setQty(1);
    setAdded(false);
  }, [slug]);

  const brand = product ? brandName(product.brand_id) : undefined;
  const category = product ? categoryById(product.category_id) : undefined;
  const pageUrl = typeof window !== 'undefined' ? (siteUrl ? `${siteUrl}/produto/${slug}` : window.location.href) : '';

  useSeo({
    title: product ? `${product.name}${brand ? ` — ${brand}` : ''}` : 'Produto',
    description: product?.short_description ?? product?.description?.slice(0, 155) ?? undefined,
    image: product?.images[0],
    jsonLd: product && !product.demo
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          ...(brand ? { brand: { '@type': 'Brand', name: brand } } : {}),
          description: product.short_description ?? product.description ?? undefined,
          image: product.images.filter((i) => !i.startsWith('data:')),
          offers: {
            '@type': 'Offer',
            priceCurrency: 'BRL',
            price: effectivePrice(product).toFixed(2),
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        }
      : undefined,
  });

  if (loading) return <Spinner />;
  if (!product) return <NotFound message="Produto não encontrado ou indisponível." />;

  const inCart = lines.find((l) => l.productId === product.id)?.quantity ?? 0;
  const maxQty = Math.max(0, product.stock - inCart);
  const out = product.stock <= 0;
  const related = products
    .filter((p) => p.id !== product.id && (p.category_id === product.category_id || (p.brand_id && p.brand_id === product.brand_id)))
    .slice(0, 4);

  const handleAdd = () => {
    add(product.id, qty);
    setAdded(true);
    setQty(1);
  };

  const images = product.images.length ? product.images : [];

  return (
    <div className="container-page py-8 sm:py-12">
      <nav aria-label="Trilha" className="text-xs text-cream/60">
        <Link to="/" className="hover:text-gold-light">Início</Link> <span aria-hidden>/</span>{' '}
        <Link to="/catalogo" className="hover:text-gold-light">Catálogo</Link>
        {category && <> <span aria-hidden>/</span> <Link to={`/catalogo/${category.slug}`} className="hover:text-gold-light">{category.name}</Link></>}
        {' '}<span aria-hidden>/</span> <span aria-current="page">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-14">
        <section aria-label="Galeria de fotos">
          <div className="aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-ink-800">
            {images.length ? (
              <img src={images[imgIndex]} alt={`${product.name} — foto ${imgIndex + 1} de ${images.length}`} className="h-full w-full object-cover" width={800} height={1000} />
            ) : (
              <span className="flex h-full items-center justify-center text-cream/40">Sem foto</span>
            )}
          </div>
          {images.length > 1 && (
            <ul className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <li key={i} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setImgIndex(i)}
                    aria-label={`Ver foto ${i + 1}`}
                    aria-current={i === imgIndex}
                    className={`block h-20 w-16 overflow-hidden rounded border-2 ${i === imgIndex ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" width={64} height={80} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="product-title">
          {product.demo && (
            <p className="mb-4 rounded border border-cream/30 bg-cream/5 px-3 py-2 text-sm text-cream/90">
              Produto de demonstração — apenas ilustrativo, não está à venda.
            </p>
          )}
          {brand && <p className="eyebrow">{brand}</p>}
          <h1 id="product-title" className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">{product.name}</h1>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-cream/75">
            {product.volume && <div><dt className="inline text-cream/50">Volume: </dt><dd className="inline">{product.volume}</dd></div>}
            {category && <div><dt className="inline text-cream/50">Categoria: </dt><dd className="inline">{category.name}</dd></div>}
          </dl>
          <div className="mt-6"><Price price={product.price} promo={product.promo_price} large /></div>
          <p className={`mt-3 text-sm font-medium ${out ? 'text-red-300' : product.stock <= 3 ? 'text-gold-light' : 'text-emerald-300'}`}>
            {out ? 'Esgotado no momento' : product.stock <= 3 ? `Últimas ${product.stock} unidades` : 'Disponível em estoque'}
          </p>

          {product.short_description && <p className="mt-6 text-cream/85">{product.short_description}</p>}

          {!out && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded border border-white/15" role="group" aria-label="Quantidade">
                <button type="button" className="icon-btn rounded-none" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Diminuir quantidade">
                  <MinusIcon width={18} height={18} />
                </button>
                <label htmlFor="qty" className="sr-only">Quantidade</label>
                <input id="qty" type="number" inputMode="numeric" min={1} max={Math.max(1, maxQty)} value={qty}
                  onChange={(e) => setQty(Math.max(1, Math.min(Math.max(1, maxQty), Number(e.target.value) || 1)))}
                  className="h-11 w-14 bg-transparent text-center text-base [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button type="button" className="icon-btn rounded-none" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty} aria-label="Aumentar quantidade">
                  <PlusIcon width={18} height={18} />
                </button>
              </div>
              <button type="button" className="btn-gold flex-1" onClick={handleAdd} disabled={maxQty <= 0}>
                {maxQty <= 0 ? 'Limite de estoque no carrinho' : 'Adicionar ao carrinho'}
              </button>
            </div>
          )}
          <div aria-live="polite" className="min-h-[1.5rem]">
            {added && (
              <p className="mt-3 text-sm text-emerald-300">
                Adicionado ao carrinho. <Link to="/carrinho" className="underline hover:text-gold-light">Ver carrinho</Link>
              </p>
            )}
          </div>

          <a
            href={whatsappLink(settings.whatsapp_number, productInquiryMessage(product, brand, qty, pageUrl))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-3 w-full"
          >
            <WhatsAppIcon /> {out ? 'Consultar disponibilidade pelo WhatsApp' : 'Comprar pelo WhatsApp'}
          </a>

          {product.description && (
            <div className="mt-10">
              <h2 className="font-display text-2xl text-gold-light">Descrição</h2>
              <div className="prose-rl mt-3">{product.description.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>
            </div>
          )}
          {product.details && (
            <details className="mt-6 rounded border border-white/10 p-4" open>
              <summary className="cursor-pointer font-display text-xl text-gold-light">Detalhes</summary>
              <div className="prose-rl mt-3 whitespace-pre-line text-cream/85">{product.details}</div>
            </details>
          )}
        </section>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-20">
          <h2 id="related" className="section-title mb-8">Você também pode gostar</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
