import type { ReactNode } from 'react';

export default function Notice({ kind, children }: { kind: 'error' | 'success'; children: ReactNode }) {
  return (
    <p role={kind === 'error' ? 'alert' : 'status'}
      className={`rounded border p-3 text-sm ${kind === 'error' ? 'border-red-400/40 bg-red-500/10 text-red-200' : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'}`}>
      {children}
    </p>
  );
}
