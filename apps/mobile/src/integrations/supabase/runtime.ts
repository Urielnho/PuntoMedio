import { createPuntoMedioClient, type PuntoMedioSupabaseClient } from './client';
import { inspectSupabasePublicConfig } from './publicConfig';

export type SupabaseRuntime =
  | { readonly state: 'ready'; readonly client: PuntoMedioSupabaseClient }
  | { readonly state: 'unconfigured' | 'invalid'; readonly client: null };

let cached: SupabaseRuntime | undefined;

export function getSupabaseRuntime(): SupabaseRuntime {
  if (cached) return cached;
  const inspected = inspectSupabasePublicConfig({
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
  if (inspected.enabled && inspected.config) {
    cached = { state: 'ready', client: createPuntoMedioClient(inspected.config) };
    return cached;
  }

  cached = {
    state: inspected.state === 'invalid' ? 'invalid' : 'unconfigured',
    client: null,
  };
  return cached;
}
