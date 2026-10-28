import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import type { Banner } from '../types';
import { ChevronLeft, ChevronRight } from './Icons';
import { emblemUrl } from './Logo';

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
        <>
          <img src={current.image_url} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" {...{ fetchpriority: 'high' }} width={1600} height={900} />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/20 md:bg-gradient-to-r md:from-ink md:via-ink/80 md:to-ink/10" />
        </>
      ) : (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_25%,#3a2d10_0%,#141006_45%,#0b0b0b_80%)] md:bg-[radial-gradient(ellipse_at_72%_45%,#3a2d10_0%,#141006_45%,#0b0b0b_80%)]" />
      )}
      <div className={`container-page flex flex-col items-center gap-8 pb-16 pt-10 text-center md:min-h-[560px] md:flex-row md:justify-between md:py-20 md:text-left ${current.image_url ? 'min-h-[60vh] justify-end' : ''}`} aria-live="polite">
        {!current.image_url && (
          <img
            src={settings.logo_url || emblemUrl}
            alt={`Emblema ${settings.store_name}`}
            width={360}
            height={360}
            className="w-44 drop-shadow-[0_10px_40px_rgba(201,165,76,0.25)] sm:w-56 md:order-2 md:w-80 lg:w-96"
            {...{ fetchpriority: 'high' }}
          />
        )}
        <div className="max-w-xl md:order-1">
          <p className="eyebrow">{settings.store_name}</p>
          <h1 className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.1] text-cream sm:text-6xl lg:text-7xl">{current.title}</h1>
          {current.subtitle && <p className="mx-auto mt-5 max-w-md text-base text-cream/80 sm:text-lg md:mx-0">{current.subtitle}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <CtaLink banner={current} />
          </div>
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
