// Copia index.html para 404.html: permite URLs amigáveis (sem #) em hospedagens estáticas como o GitHub Pages.
import { copyFileSync, writeFileSync } from 'node:fs';
copyFileSync('dist/index.html', 'dist/404.html');
writeFileSync('dist/.nojekyll', '');
console.log('postbuild: 404.html e .nojekyll gerados');
