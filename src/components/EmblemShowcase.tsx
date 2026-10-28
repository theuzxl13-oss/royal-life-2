import { useEffect, useRef } from 'react';

/**
 * Emblema "iluminado em uma galeria escura": brilho de fundo, reflexo metálico,
 * flutuação, inclinação 3D com o ponteiro e recuo ao rolar a página.
 * Tudo é desligado quando o usuário pede menos movimento.
 */
export default function EmblemShowcase({ src, alt }: { src: string; alt: string }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const progress = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.8)));
        stage.style.setProperty('--scroll', progress.toFixed(3));
      });
    };

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / window.innerWidth;
      const y = (e.clientY - (rect.top + rect.height / 2)) / window.innerHeight;
      stage.style.setProperty('--tilt-x', `${(-y * 14).toFixed(2)}deg`);
      stage.style.setProperty('--tilt-y', `${(x * 18).toFixed(2)}deg`);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (finePointer) window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div ref={stageRef} className="emblem-stage w-52 sm:w-64 md:order-2 md:w-80 lg:w-[420px]">
      <div className="emblem-glow" aria-hidden />
      <div className="emblem-float">
        <div className="emblem-tilt">
          <img src={src} alt={alt} width={420} height={420} className="block w-full" {...{ fetchpriority: 'high' }} />
          <span className="emblem-sheen" aria-hidden />
        </div>
      </div>
      <div className="emblem-reflection" aria-hidden />
    </div>
  );
}
