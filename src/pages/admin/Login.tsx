import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import Notice from '../../components/admin/Notice';
import { useAuth } from '../../context/AuthContext';
import { useSeo } from '../../hooks/useSeo';
import { demoMode } from '../../lib/config';
import { DEMO_ADMIN } from '../../services/demoApi';

export default function Login() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [attempts, setAttempts] = useState(0);
  useSeo({ title: 'Entrar no painel', noindex: true });

  const from = (location.state as { from?: string } | null)?.from ?? '/admin';
  if (session?.isAdmin) return <Navigate to={from} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (attempts >= 5) {
      setError('Muitas tentativas. Aguarde um minuto e tente novamente.');
      setTimeout(() => setAttempts(0), 60_000);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setAttempts((a) => a + 1);
      setError(err instanceof Error ? err.message : 'Falha ao entrar.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-5">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="text-center font-display text-2xl">Área administrativa</h1>
        {demoMode && (
          <div className="rounded border border-cream/30 bg-cream/5 p-3 text-xs text-cream/85">
            <strong>Demonstração</strong> (sem banco configurado): use <code className="text-gold-light">{DEMO_ADMIN.email}</code> / <code className="text-gold-light">{DEMO_ADMIN.password}</code>.
            Em produção, o acesso é feito por usuários do Supabase Auth cadastrados como administradores.
          </div>
        )}
        <div>
          <label htmlFor="email" className="label">E-mail</label>
          <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </div>
        <div>
          <label htmlFor="password" className="label">Senha</label>
          <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required minLength={6} />
        </div>
        {error && <Notice kind="error">{error}</Notice>}
        <button type="submit" className="btn-gold w-full" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
        <Link to="/" className="block text-center text-sm text-cream/60 hover:text-gold-light">← Voltar ao site</Link>
      </form>
    </div>
  );
}
