import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../services';
import type { AdminSession } from '../services/api';

interface AuthState {
  session: AdminSession | null;
  checking: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    api
      .getSession()
      .then((s) => alive && setSession(s))
      .catch(() => alive && setSession(null))
      .finally(() => alive && setChecking(false));
    const off = api.onAuthChange((s) => alive && setSession(s));
    return () => {
      alive = false;
      off();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      session,
      checking,
      signIn: async (email, password) => setSession(await api.signIn(email, password)),
      signOut: async () => {
        await api.signOut();
        setSession(null);
      },
    }),
    [session, checking],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth fora do AuthProvider');
  return ctx;
}
