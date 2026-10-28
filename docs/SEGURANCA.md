# Segurança — Royal Life Perfumaria

Revisão do painel administrativo e do site. Resume o que já está protegido, o que foi corrigido
e o que **depende de configuração** antes do lançamento.

## Como o painel é protegido

A proteção de verdade está **no banco (Supabase)**, não no site. Mesmo que alguém abra o código
do site ou acesse `/admin`, o banco só aceita alterações de quem fez login **e** está na tabela
`admins`.

| Camada | O que faz |
|---|---|
| Login (Supabase Auth) | E-mail e senha; a sessão expira e é renovada automaticamente |
| Tabela `admins` | Só usuários cadastrados nela são administradores |
| RLS (regras do banco) | Público só **lê** produtos/categorias/banners ativos; só administradores escrevem |
| Pedidos | Público não lê pedidos; cria apenas pela função `create_order` |
| Preços | Calculados **no banco** a partir do cadastro — o navegador não consegue mudar valores |
| Imagens | Envio e exclusão só por administradores; até 5 MB; JPG, PNG, WebP e AVIF |
| Cabeçalhos (`public/_headers`) | Bloqueiam scripts de terceiros (CSP), uso do site dentro de outros sites, e forçam HTTPS |

## Corrigido nesta revisão

1. **Modo demonstração aberto em produção** — antes, publicar sem as chaves do banco ligava a
   demonstração com a senha de teste pública. Agora ela só liga com `VITE_DEMO_MODE=true`,
   e o build **falha** se faltar configuração.
2. **Bibliotecas com falhas conhecidas** — React Router e Supabase atualizados.
   `npm audit --omit=dev`: **0 vulnerabilidades** no código que vai para o site.
3. **Pedidos em massa (spam)** — limite de 5 pedidos a cada 10 minutos por cliente (IP anônimo
   em hash) e 100 por hora no total.
4. **Estoque burlado** — o mesmo produto repetido em várias linhas do pedido é recusado.
5. **Links maliciosos** — banco e site aceitam só links do próprio site (`/catalogo`) ou `https://`
   (bloqueia `javascript:`, `data:` e redirecionamentos para outros sites).
6. **Imagens SVG** — removidas dos tipos aceitos (podem conter código).

## Antes de lançar (obrigatório)

- [ ] **Supabase → Authentication → Sign In / Providers → Email:** desative **"Allow new users to sign up"**.
- [ ] Use uma **senha forte** e exclusiva para o administrador (12+ caracteres).
- [ ] **Supabase → Authentication → URL Configuration:** coloque o endereço final do site em *Site URL*.
- [ ] **Nunca** coloque a chave `service_role` no site ou em variáveis da Cloudflare. Só a `anon`.
- [ ] Rode o `supabase/schema.sql` atualizado (ele é seguro para rodar de novo).

## Recomendado

- **Verificação em duas etapas (MFA)** para o administrador: o Supabase suporta códigos do
  Google Authenticator. Ainda não está implementado no painel — pode ser a próxima melhoria.
- **Cloudflare Access** (gratuito até 50 usuários) na rota `/admin*`: pede um código por e-mail
  antes de abrir o painel. É uma camada extra; a proteção principal continua sendo o banco.
- **Turnstile** (CAPTCHA da Cloudflare, gratuito) no envio de pedidos, se aparecer spam.
- Não salve a senha do painel em celulares compartilhados; use o botão **Sair** em aparelhos de terceiros.

## Riscos que continuam (conhecidos e aceitos)

- A sessão de login fica guardada no navegador/app do dono. A política de segurança (CSP)
  bloqueia scripts externos, o que reduz muito o risco de roubo dessa sessão.
- O estoque **não** é reservado no pedido: a equipe confirma no atendimento.
- Alertas restantes do `npm audit` são de ferramentas de desenvolvimento/teste (Vitest),
  que **não** vão para o site publicado.
