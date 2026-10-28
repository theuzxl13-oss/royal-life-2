import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import type { Banner } from '../types';
import { ChevronLeft, ChevronRight } from './Icons';

function CtaLink({ banner }: { banner: Banner }) {
  const href = banner.cta_link || '/catalogo';
  const label = banner.cta_label || 'Explorar catálogo';
  return /^https?:\/\//.test(href) ? (
    <a href={href} className="btn-gold" target="_blank" rel="noopener noreferrer">{label}</a>
  ) : (
    <Link to={href} className="btn-gold">{label}</Link>
  );
}

export default function Hero() {
  const { banners, settings } = useStore();
  const slides: Banner[] = banners.length
    ? banners
    : [{ id: 'default', title: settings.hero_title, subtitle: settings.hero_subtitle, image_url: null, cta_label: 'Explorar catálogo', cta_link: '/catalogo', sort_order: 0, active: true }];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = slides[Math.min(index, slides.length - 1)];

  useEffect(() => {
    if (slides.length < 2 || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  const go = (d: number) => setIndex((i) => (i + d + slides.length) % slides.length);

  return (
    <section
      className="relative isolate overflow-hidden border-b border-gold/15"
      aria-roledescription="carrossel"
      aria-label="Destaques"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {current.image_url ? (
        <img src={current.image_url} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" {...{ fetchpriority: 'high' }} width={1600} height={900} />
      ) : (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_40%,#3a2d10_0%,#141006_45%,#0b0b0b_80%)]" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/10" />
      <div className="container-page flex min-h-[70vh] flex-col justify-center py-20 sm:min-h-[560px]" aria-live="polite">
        <p className="eyebrow">{settings.store_name}</p>
        <h1 className="mt-4 max-w-xl font-display text-5xl font-semibold leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
          {current.title}
        </h1>
        {current.subtitle && <p className="mt-5 max-w-md text-base text-cream/80 sm:text-lg">{current.subtitle}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaLink banner={current} />
        </div>
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-0 right-0">
          <div className="container-page flex items-center gap-3">
            <button type="button" className="icon-btn border border-white/15" onClick={() => go(-1)} aria-label="Banner anterior">
              <ChevronLeft />
            </button>
            <button type="button" className="icon-btn border border-white/15" onClick={() => go(1)} aria-label="Próximo banner">
              <ChevronRight />
            </button>
            <div className="ml-2 flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-gold' : 'w-4 bg-white/30'}`}
                  aria-label={`Ir para o banner ${i + 1}`}
                  aria-current={i === index}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
