import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Spinner from '../components/Spinner';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../hooks/useSeo';
import { hasPromo } from '../lib/format';
import type { Product } from '../types';

function Section({ id, eyebrow, title, products, link }: { id: string; eyebrow: string; title: string; products: Product[]; link?: string }) {
  if (!products.length) return null;
  return (
    <section aria-labelledby={id} className="container-page mt-20 sm:mt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={id} className="section-title mt-2">{title}</h2>
        </div>
        {link && <Link to={link} className="text-[17px] text-gold hover:underline">Ver todos ›</Link>}
      </div>
      <ProductGrid products={products.slice(0, 8)} />
    </section>
  );
}

export default function Home() {
  const { products, categories, settings, loading, error } = useStore();
  useSeo({
    title: `${settings.store_name} — ${settings.tagline}`,
    description: 'Perfumes masculinos, femininos, unissex, body splash, kits e hidratantes. Escolha no catálogo e peça pelo WhatsApp.',
    jsonLd: { '@context': 'https://schema.org', '@type': 'Store', name: settings.store_name, slogan: settings.tagline },
  });

  const featured = products.filter((p) => p.featured);
  const launches = products.filter((p) => p.is_new);
  const offers = products.filter(hasPromo);
  // Na home, só categorias que já têm produtos (as vazias continuam no menu e no catálogo).
  const visibleCategories = loading ? categories : categories.filter((c) => products.some((p) => p.category_id === c.id));

  return (
    <>
      <Hero />

      <section aria-labelledby="categorias" className="container-page mt-16 sm:mt-24">
        <div className="text-center">
          <p className="eyebrow">Navegue por</p>
          <h2 id="categorias" className="section-title mt-2">Categorias</h2>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center">
          {visibleCategories.map((c) => (
            <li key={c.id} className="lg:w-44">
              <Link
                to={`/catalogo/${c.slug}`}
                className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-[28px] bg-ink-800 p-5 transition hover:bg-ink-700 sm:aspect-square"
              >
                {!c.image_url && <span aria-hidden className="absolute right-5 top-4 font-display text-5xl font-semibold text-gold/35 transition group-hover:text-gold/70">{c.name.charAt(0)}</span>}
                {c.image_url && <img src={c.image_url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50 transition group-hover:opacity-70" />}
                {c.image_url && <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />}
                <span className="relative font-display text-[19px] font-semibold text-cream">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {loading && <Spinner label="Carregando produtos…" />}
      {error && <p className="container-page mt-10 text-center text-red-300">{error}</p>}

      <Section id="destaques" eyebrow="Seleção" title="Produtos em destaque" products={featured} link="/catalogo" />
      <Section id="lancamentos" eyebrow="Novidades" title="Lançamentos" products={launches} link="/catalogo?ordem=newest" />
      <Section id="ofertas" eyebrow="Preços especiais" title="Ofertas" products={offers} link="/catalogo?ofertas=1" />

      {!loading && !products.length && !error && (
        <p className="container-page mt-16 text-center text-cream/70">Em breve, novos produtos no catálogo.</p>
      )}

      <section aria-labelledby="sobre-home" className="container-page mt-24">
        <div className="grid items-center gap-10 rounded-[28px] bg-ink-800 px-6 py-12 sm:px-12 sm:py-16 md:grid-cols-2">
          <div>
            <p className="eyebrow">Institucional</p>
            <h2 id="sobre-home" className="section-title mt-2">{settings.about_title}</h2>
            <div className="prose-rl mt-6">
              {(settings.about_text || 'Conte aqui a história da Royal Life Perfumaria. Edite este texto no painel administrativo.')
                .split(/\n{2,}/)
                .map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <Link to="/sobre" className="btn-outline mt-2">Conheça a Royal Life</Link>
          </div>
          <blockquote className="font-display text-[32px] font-semibold leading-[1.1] text-gold sm:text-5xl">
            “{settings.tagline}”
          </blockquote>
        </div>
      </section>

      <section className="container-page mt-24 text-center">
        <h2 className="section-title">Encontre sua fragrância</h2>
        <p className="mx-auto mt-4 max-w-md text-steel">Explore o catálogo completo, monte seu pedido e finalize o atendimento pelo WhatsApp.</p>
        <Link to="/catalogo" className="btn-gold mt-6">Explorar catálogo</Link>
      </section>
    </>
  );
}
