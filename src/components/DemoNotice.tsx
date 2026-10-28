import { demoMode } from '../lib/config';

export default function DemoNotice() {
  if (!demoMode) return null;
  return (
    <div className="bg-cream px-4 py-1.5 text-center text-xs text-ink" role="note">
      <strong>Prévia do site:</strong> estoque provisório. Alterações no painel ficam só neste navegador.
    </div>
  );
}
