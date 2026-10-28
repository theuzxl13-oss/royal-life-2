export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  active: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand_id: string | null;
  category_id: string | null;
  volume: string | null;
  short_description: string | null;
  description: string | null;
  details: string | null;
  price: number;
  promo_price: number | null;
  stock: number;
  images: string[];
  featured: boolean;
  is_new: boolean;
  active: boolean;
  created_at: string;
  /** Só existe no modo demonstração: indica conteúdo ilustrativo. */
  demo?: boolean;
}

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'demo'>;

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_link: string | null;
  sort_order: number;
  active: boolean;
}

export interface Settings {
  store_name: string;
  tagline: string;
  whatsapp_number: string;
  instagram_url: string;
  email: string;
  address: string;
  opening_hours: string;
  logo_url: string;
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_text: string;
  privacy_text: string;
  terms_text: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  volume: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export type OrderStatus = 'novo' | 'em_atendimento' | 'confirmado' | 'enviado' | 'concluido' | 'cancelado';

export interface Order {
  id: string;
  code: string;
  customer_name: string;
  notes: string | null;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
}

export interface CreatedOrder {
  id: string;
  code: string;
  total: number;
  items: OrderItem[];
}

export interface CartLine {
  productId: string;
  quantity: number;
}
