-- =====================================================================
-- Produtos da Royal Life Perfumaria (opcional). Execute DEPOIS do schema.sql.
-- Preços informados pela loja. Estoque provisório (5): ajuste no painel.
-- Fotos já enviadas pela loja ficam em public/produtos/; as demais podem ser enviadas pelo painel.
-- Pode ser executado de novo sem duplicar (usa o slug como referência).
-- =====================================================================

insert into public.brands (name, slug) values
  ('Carolina Herrera', 'carolina-herrera'),
  ('Lancôme', 'lancome'),
  ('Yves Saint Laurent', 'yves-saint-laurent'),
  ('Dior', 'dior'),
  ('Rabanne', 'rabanne'),
  ('Versace', 'versace'),
  ('Jean Paul Gaultier', 'jean-paul-gaultier'),
  ('Lattafa', 'lattafa'),
  ('Afnan', 'afnan'),
  ('Victoria''s Secret', 'victorias-secret')
on conflict (slug) do nothing;

insert into public.products
  (name, slug, brand_id, category_id, volume, short_description, description, details, price, stock, images, featured, is_new, active)
values
  ('Good Girl', 'good-girl-carolina-herrera', (select id from public.brands where slug = 'carolina-herrera'), (select id from public.categories where slug = 'femininos'), '80 ml · Eau de Parfum',
   'Oriental floral marcante, que equilibra o lado doce e o lado ousado da mulher.',
   'Good Girl une a luminosidade das flores brancas à profundidade do cacau e da fava tonka. Uma fragrância de presença, sensual e sofisticada, para quem gosta de ser lembrada.

Ideal para a noite e ocasiões especiais.',
   'Família olfativa: oriental floral
Notas de topo: amêndoa, café
Notas de coração: tuberosa, jasmim sambac
Notas de fundo: fava tonka, cacau',
   599.90, 5, '{}', true, false, true),
  ('212 VIP Rosé', '212-vip-rose-carolina-herrera', (select id from public.brands where slug = 'carolina-herrera'), (select id from public.categories where slug = 'femininos'), '80 ml · Eau de Parfum',
   'Floral frutado e efervescente, com o espírito festivo de um brinde.',
   'Alegre e vibrante, 212 VIP Rosé combina o frescor do acorde de champanhe rosé com flores delicadas e um fundo amadeirado suave.

Perfeito para festas, encontros e momentos de celebração.',
   'Família olfativa: floral frutado
Notas de topo: acorde de champanhe rosé, pimenta-rosa
Notas de coração: flor de pêssego
Notas de fundo: madeiras, almíscar',
   549.90, 5, '{}', false, false, true),
  ('La Vie Est Belle', 'la-vie-est-belle-lancome', (select id from public.brands where slug = 'lancome'), (select id from public.categories where slug = 'femininos'), '100 ml · Eau de Parfum',
   'Floral gourmand envolvente, doce na medida certa, com íris e pralinê.',
   'Um clássico contemporâneo. La Vie Est Belle traz a elegância da íris envolta em pralinê e baunilha, criando um rastro confortável, feminino e muito marcante.

Versátil, vai bem do dia à noite.',
   'Família olfativa: floral gourmand
Notas de topo: groselha negra, pera
Notas de coração: íris, jasmim, flor de laranjeira
Notas de fundo: pralinê, baunilha, patchouli, fava tonka',
   579.90, 5, '{}', true, false, true),
  ('Libre', 'libre-yves-saint-laurent', (select id from public.brands where slug = 'yves-saint-laurent'), (select id from public.categories where slug = 'femininos'), '90 ml · Eau de Parfum',
   'Floral com lavanda e flor de laranjeira: a liberdade em forma de perfume.',
   'Libre contrasta o frescor aromático da lavanda com a sensualidade da flor de laranjeira e um fundo quente de baunilha. Moderno, elegante e cheio de atitude.

Para a mulher que faz as próprias escolhas.',
   'Família olfativa: floral aromático
Notas de topo: lavanda, mandarina, groselha negra
Notas de coração: flor de laranjeira, jasmim
Notas de fundo: baunilha, almíscar, cedro, âmbar gris',
   649.90, 5, '{}', false, false, true),
  ('Sauvage', 'sauvage-dior', (select id from public.brands where slug = 'dior'), (select id from public.categories where slug = 'masculinos'), '100 ml · Eau de Toilette',
   'Fresco, apimentado e amadeirado: um dos masculinos mais marcantes da perfumaria.',
   'Sauvage combina a bergamota da Calábria com pimentas e um fundo de ambroxan que deixa um rastro intenso e limpo. Moderno, versátil e de ótima projeção.

Funciona bem em qualquer ocasião.',
   'Família olfativa: aromático fougère
Notas de topo: bergamota da Calábria, pimenta
Notas de coração: pimenta de Sichuan, lavanda, gerânio, vetiver
Notas de fundo: ambroxan, cedro, ládano',
   699.90, 5, '{}', true, false, true),
  ('1 Million', '1-million-rabanne', (select id from public.brands where slug = 'rabanne'), (select id from public.categories where slug = 'masculinos'), '100 ml · Eau de Toilette',
   'Especiado e couro, com toque doce: ousado, sedutor e cheio de presença.',
   '1 Million abre com frescor cítrico e evolui para um coração de rosa e canela, finalizando em couro e âmbar. Uma fragrância confiante, para quem gosta de ser notado.

Ideal para a noite e ocasiões especiais.',
   'Família olfativa: couro especiado
Notas de topo: mandarina sanguínea, toranja, menta
Notas de coração: rosa, canela, especiarias
Notas de fundo: couro, âmbar, madeiras, patchouli',
   599.90, 5, '{}', false, false, true),
  ('Eros', 'eros-versace', (select id from public.brands where slug = 'versace'), (select id from public.categories where slug = 'masculinos'), '100 ml · Eau de Toilette',
   'Menta, maçã verde e baunilha: fresco e intenso ao mesmo tempo.',
   'Eros mistura o frescor da menta e da maçã verde com a doçura da fava tonka e da baunilha, sobre um fundo amadeirado. Vibrante, sedutor e de excelente fixação.

Um dos favoritos para sair à noite.',
   'Família olfativa: aromático fougère
Notas de topo: menta, maçã verde, limão
Notas de coração: fava tonka, gerânio, ambroxan
Notas de fundo: baunilha, cedro, vetiver, musgo de carvalho',
   499.90, 5, '{}', false, false, true),
  ('Le Male Le Parfum', 'le-male-le-parfum-jean-paul-gaultier', (select id from public.brands where slug = 'jean-paul-gaultier'), (select id from public.categories where slug = 'masculinos'), '125 ml · Eau de Parfum',
   'Oriental amadeirado com cardamomo, lavanda e baunilha: elegante e intenso.',
   'Le Male Le Parfum é a versão mais sofisticada e profunda do clássico. O cardamomo abre caminho para a lavanda e a íris, que repousam sobre uma baunilha cremosa e amadeirada.

Perfeito para a noite e o clima mais frio.',
   'Família olfativa: oriental amadeirado
Notas de topo: cardamomo
Notas de coração: lavanda, íris
Notas de fundo: baunilha, madeiras',
   649.90, 5, '{}', false, false, true),
  ('Khamrah', 'khamrah-lattafa', (select id from public.brands where slug = 'lattafa'), (select id from public.categories where slug = 'arabes'), '100 ml · Eau de Parfum',
   'Especiado e gourmand, com tâmaras, canela e baunilha: quente e viciante.',
   'Khamrah é um perfume árabe envolvente, que combina especiarias quentes com o doce das tâmaras e do pralinê, finalizando em baunilha e madeiras ambaradas. Muito marcante e de longa duração.

Ideal para o clima frio e a noite.',
   'Família olfativa: oriental especiado
Notas de topo: canela, noz-moscada, bergamota
Notas de coração: tâmaras, pralinê, tuberosa
Notas de fundo: baunilha, fava tonka, madeiras ambaradas, mirra, benjoim',
   299.90, 5, '{}', true, false, true),
  ('Asad', 'asad-lattafa', (select id from public.brands where slug = 'lattafa'), (select id from public.categories where slug = 'arabes'), '100 ml · Eau de Parfum',
   'Âmbar especiado com pimenta-preta, tabaco e baunilha: forte e masculino.',
   'Asad traz a intensidade da pimenta-preta e do tabaco, com um coração de café e íris e um fundo quente de baunilha e âmbar. Um perfume árabe de personalidade e excelente fixação.

Para quem gosta de fragrâncias marcantes.',
   'Família olfativa: âmbar especiado
Notas de topo: pimenta-preta, abacaxi, tabaco
Notas de coração: café, íris, patchouli
Notas de fundo: baunilha, âmbar, benjoim, ládano',
   249.90, 5, '{}', false, false, true),
  ('Yara', 'yara-lattafa', (select id from public.brands where slug = 'lattafa'), (select id from public.categories where slug = 'arabes'), '100 ml · Eau de Parfum',
   'Floral gourmand cremoso, com orquídea, frutas tropicais e baunilha.',
   'Yara é doce, delicado e muito feminino. Orquídea e heliotrópio se unem a um acorde gourmand de frutas tropicais, sobre um fundo cremoso de baunilha e almíscar.

Um perfume árabe querido, ótimo para o dia a dia.',
   'Família olfativa: floral gourmand
Notas de topo: orquídea, heliotrópio, tangerina
Notas de coração: acorde gourmand, frutas tropicais
Notas de fundo: baunilha, almíscar, sândalo',
   229.90, 5, array['/produtos/yara-lattafa.webp'], false, false, true),
  ('9 PM', '9-pm-afnan', (select id from public.brands where slug = 'afnan'), (select id from public.categories where slug = 'arabes'), '100 ml · Eau de Parfum',
   'Âmbar baunilhado com maçã e canela: doce, sedutor e feito para a noite.',
   '9 PM abre com maçã, canela e lavanda, passa por flores brancas e termina em baunilha, fava tonka e âmbar. Um perfume árabe intenso, de ótima projeção.

Como o nome diz: perfeito para sair à noite.',
   'Família olfativa: âmbar baunilhado
Notas de topo: maçã, canela, lavanda, bergamota
Notas de coração: flor de laranjeira, lírio-do-vale
Notas de fundo: baunilha, fava tonka, âmbar, patchouli',
   279.90, 5, array['/produtos/9-pm-afnan.webp'], false, false, true),
  ('Bare Vanilla — Body Splash', 'bare-vanilla-body-splash-victorias-secret', (select id from public.brands where slug = 'victorias-secret'), (select id from public.categories where slug = 'body-splash'), '250 ml · Fragrance Mist',
   'Baunilha cremosa e aconchegante, com toque de cashmere.',
   'Bare Vanilla é uma bruma corporal suave e confortável, com baunilha aveludada e um toque macio de cashmere. Leve para usar a qualquer hora.

Pode ser reaplicado ao longo do dia.',
   'Notas principais: baunilha batida, cashmere
Uso: aplique sobre a pele limpa e reaplique quando desejar.',
   119.90, 5, array['/produtos/bare-vanilla-victorias-secret.webp'], false, false, true),
  ('Love Spell — Body Splash', 'love-spell-body-splash-victorias-secret', (select id from public.brands where slug = 'victorias-secret'), (select id from public.categories where slug = 'body-splash'), '250 ml · Fragrance Mist',
   'Flor de cerejeira e pêssego: frutado, floral e encantador.',
   'Love Spell combina a delicadeza da flor de cerejeira com a suculência do pêssego. Uma bruma alegre e feminina, perfeita para o dia a dia.

Pode ser reaplicado ao longo do dia.',
   'Notas principais: flor de cerejeira, pêssego
Uso: aplique sobre a pele limpa e reaplique quando desejar.',
   119.90, 5, array['/produtos/love-spell-victorias-secret.webp'], false, false, true),
  ('Kit Pure Seduction — Body Splash + Hidratante', 'kit-pure-seduction-victorias-secret', (select id from public.brands where slug = 'victorias-secret'), (select id from public.categories where slug = 'kits'), '75 ml + 75 ml',
   'Body splash e loção hidratante Pure Seduction: ameixa vermelha e frésia.',
   'Kit presente com a fragrância Pure Seduction em duas versões: a bruma perfumada e a loção hidratante. Usados juntos, prolongam o perfume na pele, com um rastro frutado e floral.

Vem em caixa de presente, ótimo para presentear.',
   'Conteúdo: 1 Fragrance Mist 75 ml + 1 Fragrance Lotion 75 ml
Notas principais: ameixa vermelha, frésia
Dica: aplique a loção primeiro e a bruma por cima.',
   199.90, 5, array['/produtos/kit-pure-seduction-victorias-secret.webp'], false, false, true)
on conflict (slug) do nothing;
