import type { ProfileDraft } from '@puntomedio/contracts';
import { ProfileRepository } from '../integrations/supabase/profileRepository';
import { getSupabaseRuntime } from '../integrations/supabase/runtime';

function client() {
  const value = getSupabaseRuntime().client;
  if (!value) throw new Error('integration_unavailable');
  return value;
}

export async function saveMyProfile(draft: ProfileDraft, avatarPath?: string | null) {
  const connection = client();
  let resolvedAvatar = avatarPath;
  if (resolvedAvatar === undefined) {
    const { data, error } = await connection.from('profiles').select('avatar_path').single();
    if (error) throw error;
    resolvedAvatar = data.avatar_path;
  }
  const result = await new ProfileRepository(connection).updateMine(draft, resolvedAvatar);
  if (result.error) throw result.error;
  return result.data;
}

export async function setCourierMode(enabled: boolean) {
  const result = await client().rpc('set_courier_enabled', { p_enabled: enabled, p_accept_rules: enabled });
  if (result.error) throw result.error;
  return result.data;
}

export async function getCourierMode() {
  const { data, error } = await client().from('courier_profiles').select('enabled').maybeSingle();
  if (error) throw error;
  return data?.enabled ?? false;
}

export async function getMyPublicProfile() {
  const connection = client();
  const { data: user, error: userError } = await connection.auth.getUser();
  if (userError || !user.user) throw userError ?? new Error('authentication_required');
  const result = await new ProfileRepository(connection).getPublic([user.user.id]);
  return result[0] ?? null;
}

export async function getPublicProfile(profileId: string) {
  const result = await new ProfileRepository(client()).getPublic([profileId]);
  return result[0] ?? null;
}

export async function getProfileReviews(profileId: string) {
  const { data, error } = await client().from('reviews').select('id,rating,comment,created_at').eq('subject_id', profileId).order('created_at', { ascending: false }).limit(20);
  if (error) throw error;
  return data;
}

export async function blockProfile(profileId: string) {
  const connection = client();
  const { data: user, error: userError } = await connection.auth.getUser();
  if (userError || !user.user) throw userError ?? new Error('authentication_required');
  const { error } = await connection.from('user_blocks').insert({ blocker_id: user.user.id, blocked_id: profileId });
  if (error) throw error;
}

export async function reportProfile(profileId: string, category: string, details: string) {
  const connection = client();
  const { data: user, error: userError } = await connection.auth.getUser();
  if (userError || !user.user) throw userError ?? new Error('authentication_required');
  const { error } = await connection.from('reports').insert({ reporter_id: user.user.id, subject_id: profileId, category: category.trim(), details: details.trim() });
  if (error) throw error;
}
