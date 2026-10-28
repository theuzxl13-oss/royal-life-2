import type { Banner, Brand, Category, Product, Settings } from '../types';
import { defaultSettings } from './api';

/** Ilustração vetorial de frasco usada SOMENTE nos itens de demonstração. */
export function bottleSvg(liquid: string, cap: string, label: string, shape = 0) {
  const body =
    shape === 1
      ? '<rect x="110" y="170" width="180" height="230" rx="90" />'
      : shape === 2
        ? '<path d="M120 180h160l20 210a15 15 0 0 1-15 15H115a15 15 0 0 1-15-15z" />'
        : '<rect x="105" y="170" width="190" height="235" rx="18" />';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1b1b"/><stop offset="1" stop-color="#0b0b0b"/></linearGradient>
<linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${liquid}" stop-opacity=".95"/><stop offset="1" stop-color="${liquid}" stop-opacity=".55"/></linearGradient>
<linearGradient id="c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${cap}"/><stop offset=".5" stop-color="#f3e3b0"/><stop offset="1" stop-color="${cap}"/></linearGradient></defs>
<rect width="400" height="500" fill="url(#bg)"/><ellipse cx="200" cy="420" rx="120" ry="14" fill="#000" opacity=".6"/>
<rect x="170" y="120" width="60" height="55" rx="6" fill="url(#c)"/><rect x="182" y="160" width="36" height="16" fill="#cfcfcf" opacity=".5"/>
<g fill="url(#l)" stroke="#e6cf8b" stroke-opacity=".35" stroke-width="2">${body}</g>
<rect x="140" y="260" width="120" height="58" rx="4" fill="#0b0b0b" opacity=".75" stroke="#c9a54c" stroke-width="1.5"/>
<text x="200" y="286" text-anchor="middle" font-family="Georgia,serif" font-size="16" fill="#e6cf8b" letter-spacing="3">${label}</text>
<text x="200" y="306" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#f4ede1" letter-spacing="3">DEMONSTRAÇÃO</text>
<path d="M135 190q10 80 0 190" stroke="#fff" stroke-opacity=".18" stroke-width="10" fill="none" stroke-linecap="round"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function bannerSvg() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs><radialGradient id="g" cx=".72" cy=".45" r=".6"><stop offset="0" stop-color="#3a2d10"/><stop offset=".55" stop-color="#141006"/><stop offset="1" stop-color="#0b0b0b"/></radialGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9c7c2e"/><stop offset=".5" stop-color="#e6cf8b"/><stop offset="1" stop-color="#9c7c2e"/></linearGradient></defs>
<rect width="1600" height="900" fill="url(#g)"/>
<g opacity=".9" transform="translate(1080 170)"><rect x="70" y="0" width="120" height="110" rx="10" fill="url(#gold)"/>
<rect x="0" y="100" width="260" height="420" rx="30" fill="#c9a54c" fill-opacity=".18" stroke="url(#gold)" stroke-width="3"/>
<rect x="40" y="260" width="180" height="90" rx="6" fill="#0b0b0b" fill-opacity=".7" stroke="#c9a54c"/>
<path d="M30 140q14 160 0 340" stroke="#fff" stroke-opacity=".15" stroke-width="16" fill="none" stroke-linecap="round"/></g>
<g fill="none" stroke="#c9a54c" stroke-opacity=".12"><circle cx="1210" cy="430" r="330"/><circle cx="1210" cy="430" r="400"/></g></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const demoCategories: Category[] = [
  ['Masculinos', 'masculinos'],
  ['Femininos', 'femininos'],
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

export const demoBrands: Brand[] = [
  { id: 'brand-a', name: 'Marca Exemplo A', slug: 'marca-exemplo-a' },
  { id: 'brand-b', name: 'Marca Exemplo B', slug: 'marca-exemplo-b' },
  { id: 'brand-c', name: 'Marca Exemplo C', slug: 'marca-exemplo-c' },
];

type Seed = [name: string, cat: string, brand: string, volume: string, price: number, promo: number | null, stock: number, featured: boolean, isNew: boolean, liquid: string, shape: number];

const seeds: Seed[] = [
  ['Exemplo Amadeirado Noir', 'masculinos', 'brand-a', '100 ml', 289.9, null, 6, true, false, '#5a3a1a', 0],
  ['Exemplo Cítrico Azul', 'masculinos', 'brand-b', '100 ml', 219.9, 189.9, 3, false, true, '#1d4f7a', 2],
  ['Exemplo Floral Rosé', 'femininos', 'brand-c', '90 ml', 259.9, null, 8, true, true, '#c47a8a', 1],
  ['Exemplo Oriental Âmbar', 'femininos', 'brand-a', '80 ml', 319.9, 279.9, 2, true, false, '#b0661c', 1],
  ['Exemplo Frescor Unissex', 'unissex', 'brand-b', '100 ml', 199.9, null, 10, false, true, '#7aa38c', 0],
  ['Exemplo Body Splash Baunilha', 'body-splash', 'brand-c', '250 ml', 79.9, null, 15, false, false, '#e3c08a', 2],
  ['Exemplo Body Splash Frutas Vermelhas', 'body-splash', 'brand-c', '250 ml', 79.9, 64.9, 0, false, false, '#a8233a', 2],
  ['Exemplo Kit Presente', 'kits', 'brand-a', '100 ml + 250 ml', 349.9, null, 4, true, true, '#3a2a10', 0],
  ['Exemplo Hidratante Corporal', 'hidratantes', 'brand-b', '200 ml', 69.9, null, 12, false, false, '#efe3cf', 1],
];

export const demoProducts: Product[] = seeds.map((s, i) => {
  const [name, cat, brand, volume, price, promo, stock, featured, isNew, liquid, shape] = s;
  const slug = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
  const label = name.split(' ').slice(1, 2)[0].toUpperCase();
  return {
    id: `demo-${i + 1}`,
    name,
    slug,
    brand_id: brand,
    category_id: `cat-${cat}`,
    volume,
    short_description: 'Produto ilustrativo para visualização do catálogo. Não está à venda.',
    description:
      'Este é um item de demonstração criado apenas para mostrar como o catálogo funciona. Cadastre os produtos reais pelo painel administrativo, com fotos, descrição, preço e estoque verdadeiros.',
    details: 'Família olfativa, notas e modo de uso: preencha com as informações do produto real.',
    price,
    promo_price: promo,
    stock,
    images: [bottleSvg(liquid, '#c9a54c', label, shape), bottleSvg(liquid, '#9c7c2e', label, (shape + 1) % 3)],
    featured,
    is_new: isNew,
    active: true,
    created_at: new Date(Date.UTC(2026, 9, 1 + i)).toISOString(),
    demo: true,
  };
});

export const demoBanners: Banner[] = [
  {
    id: 'banner-1',
    title: 'Sua essência. Sua presença.',
    subtitle: 'Fragrâncias selecionadas para marcar cada momento.',
    image_url: bannerSvg(),
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
