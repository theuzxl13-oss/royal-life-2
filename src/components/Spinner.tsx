export default function Spinner({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-cream/70">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" aria-hidden />
      {label}
    </div>
  );
}
