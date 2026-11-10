import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Platform } from 'react-native';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import type { SupabasePublicConfig } from './publicConfig';

export type PuntoMedioSupabaseClient = SupabaseClient<Database>;

export function createPuntoMedioClient(config: SupabasePublicConfig): PuntoMedioSupabaseClient {
  return createClient<Database>(config.url, config.publishableKey, {
    auth: {
      storage: Platform.OS === 'web' ? undefined : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  });
}

export function registerAuthAutoRefresh(client: PuntoMedioSupabaseClient): () => void {
  if (Platform.OS === 'web') return () => undefined;
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') client.auth.startAutoRefresh();
    else client.auth.stopAutoRefresh();
  });
  return () => {
    subscription.remove();
    client.auth.stopAutoRefresh();
  };
}
