# Royal Life Perfumaria — Catálogo online

Catálogo premium com carrinho e pedidos pelo WhatsApp, além de um painel administrativo.
Feito com **React + TypeScript + Vite + Tailwind CSS** e **Supabase** (PostgreSQL, autenticação e armazenamento de imagens).

> **Sua essência. Sua presença.**

---

## Funcionalidades

**Site (cliente)**
- Página inicial: banner rotativo configurável, botão "Explorar catálogo", categorias, destaques, lançamentos, ofertas, seção institucional, WhatsApp flutuante e rodapé com contatos e políticas.
- Catálogo (`/catalogo` e `/catalogo/<categoria>`): busca por nome ou marca (ignora acentos), filtros por categoria, marca, faixa de preço, disponibilidade e "somente ofertas", além de ordenação. Os filtros ficam na URL, então dá para compartilhar o link.
- Produto (`/produto/<slug>`): galeria, descrição, detalhes, volume, preço promocional, disponibilidade, quantidade limitada ao estoque, adicionar ao carrinho, "Comprar pelo WhatsApp" e produtos relacionados.
- Carrinho (`/carrinho`): adicionar, remover e alterar quantidades; subtotal e total; nome e observações. O pedido é **registrado no banco** e a mensagem com itens, quantidades, preços e total abre no WhatsApp oficial. **Não há pagamento online**: a equipe confirma cada pedido.
- Páginas `/sobre`, `/privacidade` e `/condicoes-de-compra` (texto-base editável), página 404 e SEO por página (título, descrição, Open Graph, canônico, JSON-LD de produto **sem** avaliações).
- Mobile first: grade de 2 colunas no celular, menu lateral, filtros em gaveta, botões com pelo menos 44 px, imagens com carregamento preguiçoso, painel carregado sob demanda.
- Acessibilidade: link "pular para o conteúdo", foco visível, navegação por teclado, `aria-*` nos controles e textos alternativos.

**Painel (`/admin`)**
- Login com Supabase Auth; só acessa quem está na tabela `admins`.
- Produtos: cadastrar, editar, excluir, ativar/desativar, destaque, lançamento, preço, preço promocional, estoque, várias fotos (envio com redimensionamento e conversão para WebP, reordenação e capa).
- Categorias (com ordem, imagem e ativação), marcas e banners.
- Pedidos: lista, filtro e atualização de status (novo, em atendimento, confirmado, enviado, concluído, cancelado).
- Configurações: número oficial do WhatsApp (com botão de teste), logo oficial, nome, frase, Instagram, e-mail, endereço, horário, textos da home, institucional e políticas.
- As alterações aparecem no site na hora, sem editar código.

---

## Segurança

- **Row Level Security** em todas as tabelas (`supabase/schema.sql`): o público só **lê** itens ativos; somente administradores escrevem.
- Pedidos são criados pela função `create_order` (security definer). Ela busca **preços e estoque no banco** (o navegador não consegue alterar valores), valida as quantidades e gera o código do pedido. O público não consegue ler pedidos.
- Imagens: bucket `catalog` com leitura pública e envio ou exclusão apenas por administradores, com limite de 5 MB e tipos de imagem permitidos.
- Credenciais em variáveis de ambiente (`.env.local`, que não é versionado). A chave `anon` do Supabase é pública por natureza; a proteção vem das políticas RLS. **Nunca** use a chave `service_role` no front-end.
- Validação no navegador e também no banco (`check constraints`).

---

## Instalação local

Pré-requisito: Node.js 20 ou superior.

```bash
npm install
cp .env.example .env.local   # preencha as variáveis
npm run dev                   # http://localhost:5173
```

Outros comandos: `npm test` (testes), `npm run build` (gera `dist/`) e `npm run preview`.

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_SUPABASE_URL` | Sim (produção) | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sim (produção) | Chave `anon` (pública) |
| `VITE_SITE_URL` | Não | URL pública, usada no link canônico (SEO) |
| `VITE_BASE_PATH` | Não | Subpasta de publicação (ex.: `/royal-life-2/`) |

**Sem** `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`, o site entra em **modo demonstração**: produtos ilustrativos marcados como "Demonstração", dados salvos apenas no navegador e login de teste `demo@royallife.local` / `demo1234`. Esse modo serve só para visualizar o projeto. Com o Supabase configurado, ele é desativado automaticamente e nenhum produto fictício aparece.

---

## Configuração do banco (Supabase)

1. Crie um projeto em <https://supabase.com>.
2. Abra **SQL Editor**, cole o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e execute. Isso cria as tabelas, as políticas RLS, a função de pedidos, o bucket de imagens e as categorias iniciais.
3. Em **Authentication → Users**, crie o usuário administrador (e-mail e senha forte). Em **Authentication → Providers → Email**, desative "Allow new users to sign up" para que ninguém crie contas.
4. Torne esse usuário administrador no SQL Editor:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'email-do-admin@exemplo.com';
   ```
5. Copie a URL e a chave `anon` (**Project Settings → API**) para o `.env.local` ou para as variáveis da hospedagem.
6. Entre em `/admin`, configure o **WhatsApp oficial**, envie a **logo**, revise os textos e as políticas e cadastre os produtos reais.

---

## Publicação

O build gera arquivos estáticos em `dist/`.

- **Vercel**: importe o repositório e defina as variáveis de ambiente. O `vercel.json` já cuida das rotas.
- **Netlify**: comando de build `npm run build`, pasta `dist`. O `public/_redirects` já cuida das rotas.
- **GitHub Pages**: o workflow `.github/workflows/deploy-pages.yml` testa, gera o build e publica na branch `gh-pages` a cada push.
  - Em **Settings → Pages**, escolha *Deploy from a branch* → `gh-pages` / `(root)` caso o GitHub não tenha ativado sozinho.
  - Para conectar ao banco, cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em **Settings → Secrets and variables → Actions**. Sem esses secrets, a página publicada fica em modo demonstração.
  - O `404.html` gerado no build permite URLs amigáveis (sem `#`).

Para usar um domínio próprio, configure-o na hospedagem e ajuste `VITE_SITE_URL` (e `VITE_BASE_PATH=/`).

---

## Estrutura

```
src/
  components/        cabeçalho, rodapé, cards, hero, WhatsApp flutuante, admin/*
  context/           StoreContext (dados), CartContext (carrinho), AuthContext (login)
  lib/               formatação, filtros, mensagens de WhatsApp, validação, imagens
  pages/             Home, Catalog, ProductPage, Cart, InfoPage, NotFound, admin/*
  services/          api.ts (contrato), supabaseApi.ts (produção), demoApi.ts (demonstração)
supabase/schema.sql  banco, RLS, storage e função de pedidos
```

## Observações importantes

- O site **não** afirma originalidade, certificações ou procedência dos produtos, nem exibe avaliações ou descontos inventados. Informe só dados confirmados no cadastro.
- Os textos de privacidade e condições de compra são um **ponto de partida**. Revise-os, de preferência com orientação jurídica.
- O estoque **não** é baixado automaticamente ao registrar um pedido, porque a venda só se confirma no atendimento. Ajuste o estoque no painel depois de confirmar.
