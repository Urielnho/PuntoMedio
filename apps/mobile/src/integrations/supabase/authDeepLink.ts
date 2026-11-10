import type { PuntoMedioSupabaseClient } from './client';

function valuesFromUrl(url: string): URLSearchParams {
  const parsed = new URL(url);
  const values = new URLSearchParams(parsed.search);
  const fragment = new URLSearchParams(parsed.hash.replace(/^#/, ''));
  fragment.forEach((value, key) => values.set(key, value));
  return values;
}

export async function consumeAuthDeepLink(client: PuntoMedioSupabaseClient, url: string): Promise<'recovery' | 'session' | 'ignored'> {
  const values = valuesFromUrl(url);
  const code = values.get('code');
  if (code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return values.get('type') === 'recovery' ? 'recovery' : 'session';
  }
  const accessToken = values.get('access_token');
  const refreshToken = values.get('refresh_token');
  if (!accessToken || !refreshToken) return 'ignored';
  const { error } = await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  if (error) throw error;
  return values.get('type') === 'recovery' ? 'recovery' : 'session';
}
