import type { Banner, Category, Settings } from '../types';
import { defaultSettings } from './api';

/** Ilustração vetorial de frasco: usada enquanto o produto não tem foto real. */
export function bottleSvg(liquid: string, cap: string, label: string, shape = 0, caption = 'DEMONSTRAÇÃO') {
  const body =
    shape === 1
      ? '<rect x="110" y="170" width="180" height="230" rx="90" />'
      : shape === 2
        ? '<path d="M120 180h160l20 210a15 15 0 0 1-15 15H115a15 15 0 0 1-15-15z" />'
        : '<rect x="105" y="170" width="190" height="235" rx="18" />';
  const fontSize = Math.min(16, Math.floor(200 / Math.max(1, label.length)));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1b1b"/><stop offset="1" stop-color="#0b0b0b"/></linearGradient>
<linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${liquid}" stop-opacity=".95"/><stop offset="1" stop-color="${liquid}" stop-opacity=".55"/></linearGradient>
<linearGradient id="c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${cap}"/><stop offset=".5" stop-color="#f3e3b0"/><stop offset="1" stop-color="${cap}"/></linearGradient></defs>
<rect width="400" height="500" fill="url(#bg)"/><ellipse cx="200" cy="420" rx="120" ry="14" fill="#000" opacity=".6"/>
<rect x="170" y="120" width="60" height="55" rx="6" fill="url(#c)"/><rect x="182" y="160" width="36" height="16" fill="#cfcfcf" opacity=".5"/>
<g fill="url(#l)" stroke="#e6cf8b" stroke-opacity=".35" stroke-width="2">${body}</g>
<rect x="125" y="260" width="150" height="58" rx="4" fill="#0b0b0b" opacity=".75" stroke="#c9a54c" stroke-width="1.5"/>
<text x="200" y="286" text-anchor="middle" font-family="Georgia,serif" font-size="${fontSize}" fill="#e6cf8b" letter-spacing="2">${label}</text>
<text x="200" y="306" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#f4ede1" letter-spacing="2">${caption}</text>
<path d="M135 190q10 80 0 190" stroke="#fff" stroke-opacity=".18" stroke-width="10" fill="none" stroke-linecap="round"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const demoCategories: Category[] = [
  ['Femininos', 'femininos'],
  ['Masculinos', 'masculinos'],
  ['Árabes', 'arabes'],
  ['Unissex', 'unissex'],
  ['Body Splash', 'body-splash'],
  ['Kits', 'kits'],
  ['Hidratantes', 'hidratantes'],
].map(([name, slug], i) => ({
  id: `cat-${slug}`,
  name,
  slug,
  description: null,
  image_url: null,
  sort_order: i + 1,
  active: true,
}));

export const demoBanners: Banner[] = [
  {
    id: 'banner-1',
    title: 'Sua essência. Sua presença.',
    subtitle: 'Fragrâncias selecionadas para marcar cada momento.',
    image_url: null,
    cta_label: 'Explorar catálogo',
    cta_link: '/catalogo',
    sort_order: 1,
    active: true,
  },
];

export const demoSettings: Settings = {
  ...defaultSettings,
  about_text:
    'A Royal Life Perfumaria reúne fragrâncias para quem entende que perfume é presença. Atendimento próximo, pelo WhatsApp, para ajudar você a encontrar a sua assinatura olfativa.\n\n(Texto de exemplo — edite no painel em Configurações.)',
};
