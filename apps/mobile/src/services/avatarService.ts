import { getSupabaseRuntime } from '../integrations/supabase/runtime';

export async function uploadMyAvatar(uri: string, mimeType = 'image/jpeg'): Promise<string> {
  const runtime = getSupabaseRuntime();
  if (!runtime.client) throw new Error('integration_unavailable');
  const { data: userData, error: userError } = await runtime.client.auth.getUser();
  if (userError || !userData.user) throw userError ?? new Error('authentication_required');
  const response = await fetch(uri);
  if (!response.ok) throw new Error('avatar_read_failed');
  const body = await response.arrayBuffer();
  const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
  const path = `${userData.user.id}/avatar.${extension}`;
  const { error: uploadError } = await runtime.client.storage.from('avatars').upload(path, body, { contentType: mimeType, upsert: true });
  if (uploadError) throw uploadError;
  const { data: profile, error: profileError } = await runtime.client.from('profiles').select('display_name,city').eq('id', userData.user.id).single();
  if (profileError || !profile.display_name || !profile.city) throw profileError ?? new Error('profile_incomplete');
  const { error: updateError } = await runtime.client.rpc('update_my_profile', { p_display_name: profile.display_name, p_city: profile.city, p_avatar_path: path });
  if (updateError) throw updateError;
  return path;
}

export async function createAvatarUrl(path: string): Promise<string> {
  const runtime = getSupabaseRuntime();
  if (!runtime.client) throw new Error('integration_unavailable');
  const { data, error } = await runtime.client.storage.from('avatars').createSignedUrl(path, 300);
  if (error) throw error;
  return data.signedUrl;
}
