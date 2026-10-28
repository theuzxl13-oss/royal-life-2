import type { Brand, Product } from '../types';
import { bottleSvg } from './demoData';

/**
 * Produtos da Royal Life usados na prévia (sem banco configurado).
 * Preços informados pela loja; estoque provisório; fotos enviadas pela loja
 * em public/produtos/ (os demais usam imagem ilustrativa até receber a foto). Os mesmos produtos estão em supabase/seed-produtos.sql.
 */
export const storeBrands: Brand[] = [
  ['Carolina Herrera', 'carolina-herrera'],
  ['Lancôme', 'lancome'],
  ['Yves Saint Laurent', 'yves-saint-laurent'],
  ['Dior', 'dior'],
  ['Rabanne', 'rabanne'],
  ['Versace', 'versace'],
  ['Jean Paul Gaultier', 'jean-paul-gaultier'],
  ['Lattafa', 'lattafa'],
  ['Afnan', 'afnan'],
  ["Victoria's Secret", 'victorias-secret'],
].map(([name, slug]) => ({ id: `brand-${slug}`, name, slug }));

interface Entry {
  name: string;
  slug: string;
  brand: string | null;
  category: string;
  volume: string;
  price: number;
  featured?: boolean;
  short: string;
  description: string;
  details: string;
  look: [liquid: string, label: string, shape: number];
  /** Arquivo em public/produtos/ (foto enviada pela loja). */
  photo?: string;
}

// Caminho relativo à raiz do site; funciona também em subpasta (GitHub Pages).
const base = (import.meta.env?.BASE_URL as string | undefined) ?? '/';
export const photoUrl = (file: string) => `${base}produtos/${file}`;

const PROVISIONAL_STOCK = 5;

const entries: Entry[] = [
  {
    name: 'Good Girl',
    slug: 'good-girl-carolina-herrera',
    brand: 'carolina-herrera',
    category: 'femininos',
    volume: '80 ml · Eau de Parfum',
    price: 599.9,
    featured: true,
    short: 'Oriental floral marcante, que equilibra o lado doce e o lado ousado da mulher.',
    description:
      'Good Girl une a luminosidade das flores brancas à profundidade do cacau e da fava tonka. Uma fragrância de presença, sensual e sofisticada, para quem gosta de ser lembrada.\n\nIdeal para a noite e ocasiões especiais.',
    details:
      'Família olfativa: oriental floral\nNotas de topo: amêndoa, café\nNotas de coração: tuberosa, jasmim sambac\nNotas de fundo: fava tonka, cacau',
    look: ['#1a2a5c', 'GOOD GIRL', 2],
    photo: 'good-girl-carolina-herrera.webp',
  },
  {
    name: '212 VIP Rosé',
    slug: '212-vip-rose-carolina-herrera',
    brand: 'carolina-herrera',
    category: 'femininos',
    volume: '80 ml · Eau de Parfum',
    price: 549.9,
    short: 'Floral frutado e efervescente, com o espírito festivo de um brinde.',
    description:
      'Alegre e vibrante, 212 VIP Rosé combina o frescor do acorde de champanhe rosé com flores delicadas e um fundo amadeirado suave.\n\nPerfeito para festas, encontros e momentos de celebração.',
    details:
      'Família olfativa: floral frutado\nNotas de topo: acorde de champanhe rosé, pimenta-rosa\nNotas de coração: flor de pêssego\nNotas de fundo: madeiras, almíscar',
    look: ['#e8a3b4', '212 VIP ROSÉ', 0],
    photo: '212-vip-rose-carolina-herrera.webp',
  },
  {
    name: 'La Vie Est Belle',
    slug: 'la-vie-est-belle-lancome',
    brand: 'lancome',
    category: 'femininos',
    volume: '100 ml · Eau de Parfum',
    price: 579.9,
    featured: true,
    short: 'Floral gourmand envolvente, doce na medida certa, com íris e pralinê.',
    description:
      'Um clássico contemporâneo. La Vie Est Belle traz a elegância da íris envolta em pralinê e baunilha, criando um rastro confortável, feminino e muito marcante.\n\nVersátil, vai bem do dia à noite.',
    details:
      'Família olfativa: floral gourmand\nNotas de topo: groselha negra, pera\nNotas de coração: íris, jasmim, flor de laranjeira\nNotas de fundo: pralinê, baunilha, patchouli, fava tonka',
    look: ['#d9a7b0', 'LA VIE EST BELLE', 1],
    photo: 'la-vie-est-belle-lancome.webp',
  },
  {
    name: 'Libre',
    slug: 'libre-yves-saint-laurent',
    brand: 'yves-saint-laurent',
    category: 'femininos',
    volume: '90 ml · Eau de Parfum',
    price: 649.9,
    short: 'Floral com lavanda e flor de laranjeira: a liberdade em forma de perfume.',
    description:
      'Libre contrasta o frescor aromático da lavanda com a sensualidade da flor de laranjeira e um fundo quente de baunilha. Moderno, elegante e cheio de atitude.\n\nPara a mulher que faz as próprias escolhas.',
    details:
      'Família olfativa: floral aromático\nNotas de topo: lavanda, mandarina, groselha negra\nNotas de coração: flor de laranjeira, jasmim\nNotas de fundo: baunilha, almíscar, cedro, âmbar gris',
    look: ['#e7c27a', 'LIBRE', 0],
    photo: 'libre-yves-saint-laurent.webp',
  },
  {
    name: 'Sauvage',
    slug: 'sauvage-dior',
    brand: 'dior',
    category: 'masculinos',
    volume: '100 ml · Eau de Parfum',
    price: 699.9,
    featured: true,
    short: 'Fresco, apimentado e levemente baunilhado: a versão Eau de Parfum de um dos masculinos mais marcantes.',
    description:
      'Sauvage Eau de Parfum combina a bergamota da Calábria com pimenta de Sichuan e especiarias, sobre um fundo de ambroxan e baunilha. Mais envolvente que a versão Eau de Toilette, com rastro intenso e elegante.\n\nFunciona bem em qualquer ocasião.',
    details:
      'Família olfativa: aromático fougère\nNotas de topo: bergamota da Calábria\nNotas de coração: pimenta de Sichuan, lavanda, anis-estrelado, noz-moscada\nNotas de fundo: ambroxan, baunilha',
    look: ['#2b3f63', 'SAUVAGE', 0],
    photo: 'sauvage-dior.webp',
  },
  {
    name: '1 Million',
    slug: '1-million-rabanne',
    brand: 'rabanne',
    category: 'masculinos',
    volume: '100 ml · Eau de Toilette',
    price: 599.9,
    short: 'Especiado e couro, com toque doce: ousado, sedutor e cheio de presença.',
    description:
      '1 Million abre com frescor cítrico e evolui para um coração de rosa e canela, finalizando em couro e âmbar. Uma fragrância confiante, para quem gosta de ser notado.\n\nIdeal para a noite e ocasiões especiais.',
    details:
      'Família olfativa: couro especiado\nNotas de topo: mandarina sanguínea, toranja, menta\nNotas de coração: rosa, canela, especiarias\nNotas de fundo: couro, âmbar, madeiras, patchouli',
    look: ['#c9a54c', '1 MILLION', 0],
    photo: '1-million-rabanne.webp',
  },
  {
    name: 'Eros',
    slug: 'eros-versace',
    brand: 'versace',
    category: 'masculinos',
    volume: '100 ml · Eau de Parfum',
    price: 499.9,
    short: 'Menta, maçã e baunilha em versão Eau de Parfum: fresco, intenso e mais encorpado.',
    description:
      'Eros Eau de Parfum mistura o frescor do limão, da menta e da maçã com a doçura da baunilha, sobre um fundo amadeirado e levemente couro. Vibrante, sedutor e de excelente fixação.\n\nUm dos favoritos para sair à noite.',
    details:
      'Família olfativa: aromático fougère\nNotas de topo: limão, menta, maçã cristalizada\nNotas de coração: ambroxan, gerânio, sálvia esclareia\nNotas de fundo: baunilha, cedro, sândalo, patchouli, couro',
    look: ['#2f8f8a', 'EROS', 2],
    photo: 'eros-versace.webp',
  },
  {
    name: 'Le Male Le Parfum',
    slug: 'le-male-le-parfum-jean-paul-gaultier',
    brand: 'jean-paul-gaultier',
    category: 'masculinos',
    volume: '125 ml · Eau de Parfum',
    price: 649.9,
    short: 'Oriental amadeirado com cardamomo, lavanda e baunilha: elegante e intenso.',
    description:
      'Le Male Le Parfum é a versão mais sofisticada e profunda do clássico. O cardamomo abre caminho para a lavanda e a íris, que repousam sobre uma baunilha cremosa e amadeirada.\n\nPerfeito para a noite e o clima mais frio.',
    details:
      'Família olfativa: oriental amadeirado\nNotas de topo: cardamomo\nNotas de coração: lavanda, íris\nNotas de fundo: baunilha, madeiras',
    look: ['#1d1d1d', 'LE MALE', 1],
    photo: 'le-male-le-parfum-jean-paul-gaultier.webp',
  },
  {
    name: 'Khamrah',
    slug: 'khamrah-lattafa',
    brand: 'lattafa',
    category: 'arabes',
    volume: '100 ml · Eau de Parfum',
    price: 299.9,
    featured: true,
    short: 'Especiado e gourmand, com tâmaras, canela e baunilha: quente e viciante.',
    description:
      'Khamrah é um perfume árabe envolvente, que combina especiarias quentes com o doce das tâmaras e do pralinê, finalizando em baunilha e madeiras ambaradas. Muito marcante e de longa duração.\n\nIdeal para o clima frio e a noite.',
    details:
      'Família olfativa: oriental especiado\nNotas de topo: canela, noz-moscada, bergamota\nNotas de coração: tâmaras, pralinê, tuberosa\nNotas de fundo: baunilha, fava tonka, madeiras ambaradas, mirra, benjoim',
    look: ['#7a2e1a', 'KHAMRAH', 1],
    photo: 'khamrah-lattafa.webp',
  },
  {
    name: 'Asad',
    slug: 'asad-lattafa',
    brand: 'lattafa',
    category: 'arabes',
    volume: '100 ml · Eau de Parfum',
    price: 249.9,
    short: 'Âmbar especiado com pimenta-preta, tabaco e baunilha: forte e masculino.',
    description:
      'Asad traz a intensidade da pimenta-preta e do tabaco, com um coração de café e íris e um fundo quente de baunilha e âmbar. Um perfume árabe de personalidade e excelente fixação.\n\nPara quem gosta de fragrâncias marcantes.',
    details:
      'Família olfativa: âmbar especiado\nNotas de topo: pimenta-preta, abacaxi, tabaco\nNotas de coração: café, íris, patchouli\nNotas de fundo: baunilha, âmbar, benjoim, ládano',
    look: ['#3a2a14', 'ASAD', 0],
    photo: 'asad-lattafa.webp',
  },
  {
    name: 'Yara',
    slug: 'yara-lattafa',
    brand: 'lattafa',
    category: 'arabes',
    volume: '100 ml · Eau de Parfum',
    price: 229.9,
    short: 'Floral gourmand cremoso, com orquídea, frutas tropicais e baunilha.',
    description:
      'Yara é doce, delicado e muito feminino. Orquídea e heliotrópio se unem a um acorde gourmand de frutas tropicais, sobre um fundo cremoso de baunilha e almíscar.\n\nUm perfume árabe querido, ótimo para o dia a dia.',
    details:
      'Família olfativa: floral gourmand\nNotas de topo: orquídea, heliotrópio, tangerina\nNotas de coração: acorde gourmand, frutas tropicais\nNotas de fundo: baunilha, almíscar, sândalo',
    look: ['#e9a9c4', 'YARA', 2],
    photo: 'yara-lattafa.webp',
  },
  {
    name: '9 PM',
    slug: '9-pm-afnan',
    brand: 'afnan',
    category: 'arabes',
    volume: '100 ml · Eau de Parfum',
    price: 279.9,
    short: 'Âmbar baunilhado com maçã e canela: doce, sedutor e feito para a noite.',
    description:
      '9 PM abre com maçã, canela e lavanda, passa por flores brancas e termina em baunilha, fava tonka e âmbar. Um perfume árabe intenso, de ótima projeção.\n\nComo o nome diz: perfeito para sair à noite.',
    details:
      'Família olfativa: âmbar baunilhado\nNotas de topo: maçã, canela, lavanda, bergamota\nNotas de coração: flor de laranjeira, lírio-do-vale\nNotas de fundo: baunilha, fava tonka, âmbar, patchouli',
    look: ['#151515', '9 PM', 0],
    photo: '9-pm-afnan.webp',
  },
  {
    name: 'Bare Vanilla — Body Splash',
    slug: 'bare-vanilla-body-splash-victorias-secret',
    brand: 'victorias-secret',
    category: 'body-splash',
    volume: '250 ml · Fragrance Mist',
    price: 119.9,
    short: 'Baunilha cremosa e aconchegante, com toque de cashmere.',
    description:
      'Bare Vanilla é uma bruma corporal suave e confortável, com baunilha aveludada e um toque macio de cashmere. Leve para usar a qualquer hora.\n\nPode ser reaplicado ao longo do dia.',
    details: 'Notas principais: baunilha batida, cashmere\nUso: aplique sobre a pele limpa e reaplique quando desejar.',
    look: ['#ead2b0', 'BARE VANILLA', 2],
    photo: 'bare-vanilla-victorias-secret.webp',
  },
  {
    name: 'Love Spell — Body Splash',
    slug: 'love-spell-body-splash-victorias-secret',
    brand: 'victorias-secret',
    category: 'body-splash',
    volume: '250 ml · Fragrance Mist',
    price: 119.9,
    short: 'Flor de cerejeira e pêssego: frutado, floral e encantador.',
    description:
      'Love Spell combina a delicadeza da flor de cerejeira com a suculência do pêssego. Uma bruma alegre e feminina, perfeita para o dia a dia.\n\nPode ser reaplicado ao longo do dia.',
    details: 'Notas principais: flor de cerejeira, pêssego\nUso: aplique sobre a pele limpa e reaplique quando desejar.',
    look: ['#c2477a', 'LOVE SPELL', 2],
    photo: 'love-spell-victorias-secret.webp',
  },
  {
    name: 'Kit Pure Seduction — Body Splash + Hidratante',
    slug: 'kit-pure-seduction-victorias-secret',
    brand: 'victorias-secret',
    category: 'kits',
    volume: '75 ml + 75 ml',
    price: 199.9,
    short: 'Body splash e loção hidratante Pure Seduction: ameixa vermelha e frésia.',
    description:
      'Kit presente com a fragrância Pure Seduction em duas versões: a bruma perfumada e a loção hidratante. Usados juntos, prolongam o perfume na pele, com um rastro frutado e floral.\n\nVem em caixa de presente, ótimo para presentear.',
    details:
      'Conteúdo: 1 Fragrance Mist 75 ml + 1 Fragrance Lotion 75 ml\nNotas principais: ameixa vermelha, frésia\nDica: aplique a loção primeiro e a bruma por cima.',
    look: ['#c2185b', 'PURE SEDUCTION', 1],
    photo: 'kit-pure-seduction-victorias-secret.webp',
  },
];

export const storeProducts: Product[] = entries.map((e, i) => ({
  id: `prod-${e.slug}`,
  name: e.name,
  slug: e.slug,
  brand_id: e.brand ? `brand-${e.brand}` : null,
  category_id: `cat-${e.category}`,
  volume: e.volume,
  short_description: e.short,
  description: e.description,
  details: e.details,
  price: e.price,
  promo_price: null,
  stock: PROVISIONAL_STOCK,
  images: e.photo ? [photoUrl(e.photo)] : [bottleSvg(e.look[0], '#c9a54c', e.look[1], e.look[2], 'IMAGEM ILUSTRATIVA')],
  featured: Boolean(e.featured),
  is_new: false,
  active: true,
  created_at: new Date(Date.UTC(2026, 9, 1, 0, entries.length - i)).toISOString(),
}));
