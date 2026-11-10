import { getSupabaseRuntime } from '../integrations/supabase/runtime';

function client() {
  const value = getSupabaseRuntime().client;
  if (!value) throw new Error('integration_unavailable');
  return value;
}

export const notificationService = {
  async list() {
    const { data, error } = await client().from('notifications').select('*').order('created_at', { ascending: false }).limit(50);
    if (error) throw error;
    return data;
  },
  async markRead(id: string) {
    const { error } = await client().from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
  },
};
