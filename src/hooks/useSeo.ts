import { useEffect } from 'react';
import { siteUrl } from '../lib/config';

interface SeoOptions {
  title: string;
  description?: string;
  image?: string;
  jsonLd?: object;
  noindex?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Título, descrição, Open Graph, link canônico e JSON-LD por página. */
export function useSeo({ title, description, image, jsonLd, noindex }: SeoOptions) {
  const json = jsonLd ? JSON.stringify(jsonLd) : '';
  useEffect(() => {
    const full = title.includes('Royal Life') ? title : `${title} | Royal Life Perfumaria`;
    document.title = full;
    setMeta('property', 'og:title', full);
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    if (image && !image.startsWith('data:')) setMeta('property', 'og:image', image);
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (siteUrl) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = siteUrl + window.location.pathname.replace(import.meta.env.BASE_URL.replace(/\/$/, ''), '');
    }

    let script: HTMLScriptElement | null = null;
    if (json) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = json;
      document.head.appendChild(script);
    }
    return () => {
      script?.remove();
    };
  }, [title, description, image, json, noindex]);
}
