/** Public values only. This module never creates a client or performs a request. */
export interface SupabasePublicConfig {
  readonly url: string;
  readonly publishableKey: string;
}

export interface PreparedSupabaseConfig {
  readonly enabled: boolean;
  readonly state: 'unconfigured' | 'prepared' | 'invalid';
  readonly config: SupabasePublicConfig | null;
}

export function inspectSupabasePublicConfig(environment: Readonly<Record<string, string | undefined>>): PreparedSupabaseConfig {
  const url = environment['EXPO_PUBLIC_SUPABASE_URL']?.trim();
  const key = environment['EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY']?.trim();
  if (!url || !key) return { enabled: false, state: 'unconfigured', config: null };
  // Secrets must never be supplied to a mobile configuration, even in a later stage.
  if (!url.startsWith('https://') || !key.startsWith('sb_publishable_')) {
    return { enabled: false, state: 'invalid', config: null };
  }
  return { enabled: true, state: 'prepared', config: { url, publishableKey: key } };
}


