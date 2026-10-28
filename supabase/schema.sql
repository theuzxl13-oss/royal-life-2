-- =====================================================================
-- Royal Life Perfumaria — esquema do banco (Supabase / PostgreSQL)
-- Execute este arquivo inteiro no SQL Editor do Supabase.
-- É idempotente: pode ser executado novamente sem perder dados.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Administradores: somente usuários listados aqui acessam o painel.
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- Catálogo
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text check (char_length(description) <= 500),
  image_url text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 140),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  brand_id uuid references public.brands (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  volume text check (char_length(volume) <= 40),
  short_description text check (char_length(short_description) <= 300),
  description text check (char_length(description) <= 5000),
  details text check (char_length(details) <= 5000),
  price numeric(10,2) not null check (price >= 0),
  promo_price numeric(10,2) check (promo_price is null or (promo_price >= 0 and promo_price < price)),
  stock int not null default 0 check (stock >= 0),
  images text[] not null default '{}',
  featured boolean not null default false,
  is_new boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_brand_idx on public.products (brand_id);
create index if not exists products_active_idx on public.products (active);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 120),
  subtitle text check (char_length(subtitle) <= 300),
  image_url text,
  cta_label text check (char_length(cta_label) <= 40),
  cta_link text check (char_length(cta_link) <= 300),
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Configurações gerais (linha única, id = 1): WhatsApp, textos, contatos.
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  store_name text not null default 'Royal Life Perfumaria',
  tagline text not null default 'Sua essência. Sua presença.',
  whatsapp_number text not null default '' check (whatsapp_number ~ '^[0-9]{0,15}$'),
  instagram_url text default '',
  email text default '',
  address text default '',
  opening_hours text default '',
  logo_url text default '',
  hero_title text default 'Sua essência. Sua presença.',
  hero_subtitle text default 'Fragrâncias selecionadas para marcar cada momento.',
  about_title text default 'Sobre a Royal Life',
  about_text text default '',
  privacy_text text default '',
  terms_text text default '',
  updated_at timestamptz not null default now()
);
insert into public.settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Pedidos (registrados quando o cliente envia o pedido pelo WhatsApp).
-- O pagamento NÃO é processado no site: a equipe confirma cada pedido.
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  customer_name text not null check (char_length(customer_name) between 2 and 120),
  notes text check (char_length(notes) <= 1000),
  items jsonb not null,
  total numeric(10,2) not null check (total >= 0),
  status text not null default 'novo'
    check (status in ('novo', 'em_atendimento', 'confirmado', 'enviado', 'concluido', 'cancelado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

-- Cria o pedido no servidor: preços e estoque vêm do banco, nunca do navegador.
-- p_items: [{ "product_id": "<uuid>", "quantity": 2 }, ...]
create or replace function public.create_order(p_customer_name text, p_notes text, p_items jsonb)
returns table (order_id uuid, order_code text, order_total numeric, order_items jsonb)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty int;
  v_unit numeric(10,2);
  v_items jsonb := '[]'::jsonb;
  v_total numeric(10,2) := 0;
  v_code text;
  v_id uuid;
begin
  if p_customer_name is null or char_length(trim(p_customer_name)) < 2 then
    raise exception 'Informe seu nome.';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'O carrinho está vazio.';
  end if;
  if jsonb_array_length(p_items) > 50 then
    raise exception 'Itens demais no pedido.';
  end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item ->> 'quantity')::int;
    select * into v_product from public.products
      where id = (v_item ->> 'product_id')::uuid and active = true;
    if not found then
      raise exception 'Produto indisponível.';
    end if;
    if v_qty is null or v_qty < 1 or v_qty > v_product.stock then
      raise exception 'Quantidade indisponível para %.', v_product.name;
    end if;
    v_unit := coalesce(v_product.promo_price, v_product.price);
    v_total := v_total + v_unit * v_qty;
    v_items := v_items || jsonb_build_object(
      'product_id', v_product.id, 'name', v_product.name, 'volume', v_product.volume,
      'quantity', v_qty, 'unit_price', v_unit, 'subtotal', v_unit * v_qty);
  end loop;

  v_code := 'RL' || to_char(now() at time zone 'America/Sao_Paulo', 'YYMMDD') || '-' ||
            upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 5));

  insert into public.orders (code, customer_name, notes, items, total)
    values (v_code, trim(p_customer_name), nullif(trim(coalesce(p_notes, '')), ''), v_items, v_total)
    returning id into v_id;

  return query select v_id, v_code, v_total, v_items;
end;
$$;

revoke all on function public.create_order(text, text, jsonb) from public;
grant execute on function public.create_order(text, text, jsonb) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.banners enable row level security;
alter table public.settings enable row level security;
alter table public.orders enable row level security;

-- admins: cada usuário só enxerga o próprio registro (para o painel saber se é admin).
drop policy if exists "admins_self_read" on public.admins;
create policy "admins_self_read" on public.admins for select using (user_id = auth.uid());

-- Leitura pública apenas do que está ativo; administradores leem e escrevem tudo.
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories for select using (active or public.is_admin());
drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "brands_public_read" on public.brands;
create policy "brands_public_read" on public.brands for select using (true);
drop policy if exists "brands_admin_write" on public.brands;
create policy "brands_admin_write" on public.brands for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products for select using (active or public.is_admin());
drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "banners_public_read" on public.banners;
create policy "banners_public_read" on public.banners for select using (active or public.is_admin());
drop policy if exists "banners_admin_write" on public.banners;
create policy "banners_admin_write" on public.banners for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings_public_read" on public.settings;
create policy "settings_public_read" on public.settings for select using (true);
drop policy if exists "settings_admin_update" on public.settings;
create policy "settings_admin_update" on public.settings for update using (public.is_admin()) with check (public.is_admin());

-- Pedidos: ninguém lê/insere diretamente além dos administradores.
-- Clientes criam pedidos apenas pela função create_order (acima).
drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all" on public.orders for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Storage: bucket público de imagens; somente administradores enviam/excluem.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog', 'catalog', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "catalog_public_read" on storage.objects;
create policy "catalog_public_read" on storage.objects for select using (bucket_id = 'catalog');
drop policy if exists "catalog_admin_insert" on storage.objects;
create policy "catalog_admin_insert" on storage.objects for insert with check (bucket_id = 'catalog' and public.is_admin());
drop policy if exists "catalog_admin_update" on storage.objects;
create policy "catalog_admin_update" on storage.objects for update using (bucket_id = 'catalog' and public.is_admin());
drop policy if exists "catalog_admin_delete" on storage.objects;
create policy "catalog_admin_delete" on storage.objects for delete using (bucket_id = 'catalog' and public.is_admin());

-- ---------------------------------------------------------------------
-- Categorias iniciais (ajuste no painel conforme o estoque real).
-- Os produtos da loja estão em supabase/seed-produtos.sql (opcional).
-- ---------------------------------------------------------------------
insert into public.categories (name, slug, sort_order) values
  ('Femininos', 'femininos', 1),
  ('Masculinos', 'masculinos', 2),
  ('Árabes', 'arabes', 3),
  ('Unissex', 'unissex', 4),
  ('Body Splash', 'body-splash', 5),
  ('Kits', 'kits', 6),
  ('Hidratantes', 'hidratantes', 7)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- Para tornar um usuário administrador (crie-o antes em Authentication > Users):
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'email-do-admin@exemplo.com';
-- ---------------------------------------------------------------------
