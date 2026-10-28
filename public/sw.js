// Service worker mínimo: torna o site instalável como aplicativo.
// Não guarda nada em cache, para pedidos, estoque e preços estarem sempre atualizados.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
