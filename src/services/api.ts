import type { Banner, Brand, CartLine, Category, CreatedOrder, Order, OrderStatus, Product, ProductInput, Settings } from '../types';

export interface AdminSession {
  email: string;
  isAdmin: boolean;
}

export interface Api {
  getSettings(): Promise<Settings>;
  updateSettings(values: Partial<Settings>): Promise<Settings>;

  listCategories(includeInactive?: boolean): Promise<Category[]>;
  saveCategory(values: Omit<Category, 'id'>, id?: string): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  listBrands(): Promise<Brand[]>;
  saveBrand(values: Omit<Brand, 'id'>, id?: string): Promise<Brand>;
  deleteBrand(id: string): Promise<void>;

  listProducts(includeInactive?: boolean): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProduct(id: string): Promise<Product | null>;
  saveProduct(values: ProductInput, id?: string): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  listBanners(includeInactive?: boolean): Promise<Banner[]>;
  saveBanner(values: Omit<Banner, 'id'>, id?: string): Promise<Banner>;
  deleteBanner(id: string): Promise<void>;

  uploadImage(file: File, folder: string): Promise<string>;

  createOrder(customerName: string, notes: string, lines: CartLine[]): Promise<CreatedOrder>;
  listOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<void>;

  signIn(email: string, password: string): Promise<AdminSession>;
  signOut(): Promise<void>;
  getSession(): Promise<AdminSession | null>;
  onAuthChange(cb: (session: AdminSession | null) => void): () => void;
}

export const defaultSettings: Settings = {
  store_name: 'Royal Life Perfumaria',
  tagline: 'Sua essência. Sua presença.',
  whatsapp_number: '',
  instagram_url: '',
  email: '',
  address: '',
  opening_hours: '',
  logo_url: '',
  hero_title: 'Sua essência. Sua presença.',
  hero_subtitle: 'Fragrâncias selecionadas para marcar cada momento.',
  about_title: 'Sobre a Royal Life',
  about_text: '',
  privacy_text: '',
  terms_text: '',
};

/** Erro com mensagem amigável para exibir ao usuário. */
export class ApiError extends Error {}
