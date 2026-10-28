/**
 * "Instalar aplicativo": guarda o convite de instalação do navegador (Android/Chrome)
 * para o painel oferecer um botão. No iPhone a instalação é manual (Compartilhar →
 * Adicionar à Tela de Início).
 */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();

export function initInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as InstallPromptEvent;
    listeners.forEach((l) => l());
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    listeners.forEach((l) => l());
  });
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => undefined);
  }
}

export const canPromptInstall = () => deferred !== null;
export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
export const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

export async function promptInstall() {
  if (!deferred) return false;
  await deferred.prompt();
  const { outcome } = await deferred.userChoice;
  deferred = null;
  listeners.forEach((l) => l());
  return outcome === 'accepted';
}

export function onInstallChange(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Troca o manifesto da página (devolve a função que desfaz): o painel instala como "RL Painel" e abre direto em /admin. */
export function applyAdminManifest() {
  const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
  if (!link) return () => undefined;
  const original = link.href;
  link.href = `${import.meta.env.BASE_URL}admin.webmanifest`;
  return () => {
    link.href = original;
  };
}
