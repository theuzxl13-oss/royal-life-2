// GitHub Pages não tem regra de "SPA": o 404.html (cópia do index) permite URLs amigáveis lá.
// Na Cloudflare Pages não pode existir 404.html, senão rotas válidas responderiam com status 404.
import { copyFileSync, writeFileSync } from 'node:fs';
if (process.env.GH_PAGES === 'true') {
  copyFileSync('dist/index.html', 'dist/404.html');
  writeFileSync('dist/.nojekyll', '');
  console.log('postbuild: 404.html e .nojekyll gerados (GitHub Pages)');
}
