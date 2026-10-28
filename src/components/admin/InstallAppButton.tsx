import { useEffect, useState } from 'react';
import { canPromptInstall, isIos, isStandalone, onInstallChange, promptInstall } from '../../lib/install';

/** Botão "Instalar app" do painel (Android) ou instrução de instalação (iPhone). */
export default function InstallAppButton() {
  const [available, setAvailable] = useState(canPromptInstall());
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    const off = onInstallChange(() => setAvailable(canPromptInstall()));
    return () => {
      off();
    };
  }, []);

  if (isStandalone()) return null;

  if (available) {
    return (
      <button type="button" className="btn-gold mt-4 w-full text-sm" onClick={() => promptInstall()}>
        Instalar app do painel
      </button>
    );
  }

  if (isIos()) {
    return (
      <div className="mt-4">
        <button type="button" className="btn-outline w-full text-sm" onClick={() => setShowIosHelp((v) => !v)} aria-expanded={showIosHelp}>
          Instalar no iPhone
        </button>
        {showIosHelp && (
          <p className="mt-2 rounded-2xl bg-ink-700 p-3 text-xs text-cream/85">
            No Safari, toque em <strong>Compartilhar</strong> (quadrado com seta) e depois em <strong>Adicionar à Tela de Início</strong>.
          </p>
        )}
      </div>
    );
  }
  return null;
}
