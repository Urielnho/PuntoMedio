import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { ProfileDraft } from '@puntomedio/contracts';
import { useAuth } from '../hooks/useAuth';
import { getSupabaseRuntime } from '../integrations/supabase/runtime';

const emptyDraft: ProfileDraft = {
  displayName: '', email: '', city: '', termsAccepted: false, privacyAccepted: false,
};

type DraftState = {
  draft: ProfileDraft;
  update: <K extends keyof ProfileDraft>(field: K, value: ProfileDraft[K]) => void;
  clear: () => void;
};

export const ProfileDraftContext = createContext<DraftState | null>(null);

/** Screen-only memory: no password, session, verification claim or persisted profile. */
export function ProfileDraftProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft);
  const update = useCallback(<K extends keyof ProfileDraft,>(field: K, value: ProfileDraft[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
  }, []);
  const clear = useCallback(() => setDraft(emptyDraft), []);
  useEffect(() => {
    if (!user) { setDraft(emptyDraft); return; }
    const client = getSupabaseRuntime().client;
    if (!client) return;
    void client.from('profiles').select('display_name,city,terms_accepted_at,privacy_accepted_at').eq('id', user.id).single().then(({ data }) => {
      if (!data) return;
      setDraft({ displayName: data.display_name ?? '', email: user.email ?? '', city: data.city ?? '', termsAccepted: data.terms_accepted_at !== null, privacyAccepted: data.privacy_accepted_at !== null });
    });
  }, [user]);
  const value = useMemo(() => ({ draft, update, clear }), [draft, update, clear]);
  return <ProfileDraftContext.Provider value={value}>{children}</ProfileDraftContext.Provider>;
}
