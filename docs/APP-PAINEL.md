# Aplicativo do painel (para o dono da loja)

O painel já funciona como **aplicativo instalável** (PWA): ícone próprio na tela inicial,
abre em tela cheia direto em **Pedidos/Painel**, sem barra do navegador, e continua logado.
Atualiza sozinho a cada publicação do site — não precisa reinstalar.

> Só funciona depois que o site estiver publicado com o banco configurado (Cloudflare + Supabase).

## Opção 1 — Instalar pelo próprio site (recomendado, grátis)

**Android (Chrome):**
1. Abra `https://SEU-DOMINIO/admin` e faça login.
2. No menu do painel, toque em **"Instalar app do painel"**
   (ou no menu ⋮ do Chrome → **Instalar app**).
3. Aparece o ícone **RL Painel** na tela inicial.
   Segurando o ícone, há atalhos para **Pedidos** e **Novo produto**.

**iPhone (Safari):**
1. Abra `https://SEU-DOMINIO/admin` no **Safari** e faça login.
2. Toque em **Compartilhar** (quadrado com seta ↑) → **Adicionar à Tela de Início**.

## Opção 2 — Gerar um APK (Android)

Para ter um arquivo `.apk` (ou publicar na Play Store), use o **PWABuilder**, gratuito e da Microsoft:

1. Acesse <https://www.pwabuilder.com> e cole `https://SEU-DOMINIO/admin`.
2. Clique em **Package For Stores → Android → Generate Package**.
   - *Package ID:* por exemplo `br.com.royallife.painel`
   - Deixe o PWABuilder **criar a chave de assinatura** e **guarde o arquivo da chave e as senhas**
     em local seguro (sem elas não dá para atualizar o app depois).
3. O download traz:
   - o **APK** para instalar direto no celular do dono (permitir "instalar de fontes desconhecidas");
   - o arquivo **`assetlinks.json`**.
4. Coloque o `assetlinks.json` em `public/.well-known/assetlinks.json` neste projeto e publique.
   Isso remove a barra de endereço de dentro do app.
5. Para a **Play Store**: conta de desenvolvedor Google (taxa única de US$ 25) e envio do arquivo `.aab`.

## Notificação de pedido novo

Ainda não implementada. Com o app instalado e o banco configurado, é possível fazer o celular
do dono avisar quando chegar pedido (notificações push via Supabase). Fica como próxima etapa.
