import { demoMode } from '../lib/config';

export default function DemoNotice() {
  if (!demoMode) return null;
  return (
    <div className="bg-cream px-4 py-1.5 text-center text-xs text-ink" role="note">
      <strong>Modo demonstração:</strong> produtos ilustrativos, não estão à venda. Os dados ficam só neste navegador até o banco ser configurado.
    </div>
  );
}
