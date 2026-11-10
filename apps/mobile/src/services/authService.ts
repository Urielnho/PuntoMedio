import type { ProfileDraft } from '@puntomedio/contracts';
import { AuthGateway } from '../integrations/supabase/authGateway';
import { ProfileRepository } from '../integrations/supabase/profileRepository';
import { getSupabaseRuntime } from '../integrations/supabase/runtime';

function requireClient() {
  const runtime = getSupabaseRuntime();
  if (!runtime.client) throw new Error('integration_unavailable');
  return runtime.client;
}

export const authService = {
  async register(draft: ProfileDraft, password: string) {
    const client = requireClient();
    const { data: existing } = await client.auth.getSession();
    if (existing.session) {
      const profile = await new ProfileRepository(client).updateMine(draft, null);
      if (profile.error) throw profile.error;
      return { user: existing.session.user, session: existing.session };
    }
    const response = await new AuthGateway(client).signUpWithEmail(draft.email, password);
    if (response.error) throw response.error;
    if (response.data.session) {
      const profile = await new ProfileRepository(client).updateMine(draft, null);
      if (profile.error) throw profile.error;
    }
    return response.data;
  },
  async signIn(email: string, password: string) {
    const client = requireClient();
    const response = await new AuthGateway(client).signInWithEmail(email, password);
    if (response.error) throw response.error;
    const { data: profile, error } = await client.from('profiles').select('status').eq('id', response.data.user.id).single();
    if (error) throw error;
    return { auth: response.data, needsOnboarding: profile.status !== 'complete' };
  },
  async recover(email: string, redirectTo: string) {
    const response = await new AuthGateway(requireClient()).requestPasswordRecovery(email, redirectTo);
    if (response.error) throw response.error;
  },
  async updatePassword(password: string) {
    const { error } = await requireClient().auth.updateUser({ password });
    if (error) throw error;
  },
  async signOut() {
    const response = await new AuthGateway(requireClient()).signOut();
    if (response.error) throw response.error;
  },
};
