import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { AccountReadiness } from '@puntomedio/contracts';
import { getSupabaseRuntime } from '../integrations/supabase/runtime';
import { registerAuthAutoRefresh } from '../integrations/supabase/client';
import { Linking } from 'react-native';
import { consumeAuthDeepLink } from '../integrations/supabase/authDeepLink';

type AuthState = {
  readonly integration: 'ready' | 'unconfigured' | 'invalid';
  readonly loading: boolean;
  readonly session: Session | null;
  readonly user: User | null;
  readonly readiness: AccountReadiness | null;
  readonly readinessLoading: boolean;
  readonly readinessError: boolean;
  readonly recoveryMode: boolean;
  readonly finishRecovery: () => void;
  readonly refreshReadiness: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const runtime = useMemo(getSupabaseRuntime, []);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(runtime.state === 'ready');
  const [readiness, setReadiness] = useState<AccountReadiness | null>(null);
  const [readinessLoading, setReadinessLoading] = useState(false);
  const [readinessError, setReadinessError] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);

  const refreshReadiness = useCallback(async () => {
    const userId = session?.user.id;
    if (!runtime.client || !userId) { setReadiness(null); setReadinessLoading(false); setReadinessError(false); return; }
    setReadinessLoading(true);
    setReadinessError(false);
    try {
      const { data, error } = await runtime.client.from('profiles').select('id,status,email_verified,avatar_path,display_name,city,terms_accepted_at,privacy_accepted_at').eq('id', userId).single();
      if (error) throw error;
      const existingProfileComplete = Boolean(
        data.email_verified
        && data.avatar_path
        && data.display_name?.trim()
        && data.city?.trim()
        && data.terms_accepted_at
        && data.privacy_accepted_at,
      );
      const completion = data.status === 'suspended'
        ? 'incomplete'
        : data.status === 'complete' || existingProfileComplete
          ? 'complete'
          : data.status;
      setReadiness({ userId: data.id, completion, emailVerified: data.email_verified, hasAvatar: data.avatar_path !== null });
    } catch (error) {
      setReadiness(null);
      setReadinessError(true);
      throw error;
    } finally {
      setReadinessLoading(false);
    }
  }, [runtime.client, session?.user.id]);

  useEffect(() => {
    if (!runtime.client) return undefined;
    let active = true;
    const stopRefresh = registerAuthAutoRefresh(runtime.client);
    void runtime.client.auth.getSession().then(({ data }) => {
      if (active) { setSession(data.session); setLoading(false); }
    });
    const handleUrl = (url: string) => { void consumeAuthDeepLink(runtime.client, url).then((result) => { if (result === 'recovery') setRecoveryMode(true); }).catch(() => undefined); };
    void Linking.getInitialURL().then((url) => { if (url) handleUrl(url); });
    const urlListener = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    const { data: listener } = runtime.client.auth.onAuthStateChange((event, next) => { setSession(next); if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true); });
    return () => { active = false; listener.subscription.unsubscribe(); urlListener.remove(); stopRefresh(); };
  }, [runtime.client]);

  useEffect(() => { void refreshReadiness().catch(() => undefined); }, [refreshReadiness]);

  const finishRecovery = useCallback(() => setRecoveryMode(false), []);
  const value = useMemo<AuthState>(() => ({ integration: runtime.state, loading, session, user: session?.user ?? null, readiness, readinessLoading, readinessError, recoveryMode, finishRecovery, refreshReadiness }), [finishRecovery, loading, readiness, readinessError, readinessLoading, recoveryMode, refreshReadiness, runtime.state, session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
