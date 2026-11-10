import type { ProfileDraft, PublicProfile } from '@puntomedio/contracts';
import type { PuntoMedioSupabaseClient } from './client';

export class ProfileRepository {
  constructor(private readonly client: PuntoMedioSupabaseClient) {}

  async updateMine(draft: ProfileDraft, avatarPath: string | null) {
    return this.client.rpc('update_my_profile', {
      p_display_name: draft.displayName,
      p_city: draft.city,
      p_avatar_path: avatarPath,
      p_accept_terms: draft.termsAccepted,
      p_accept_privacy: draft.privacyAccepted,
    });
  }

  async getPublic(ids: readonly string[]): Promise<readonly PublicProfile[]> {
    const { data, error } = await this.client.rpc('get_public_profiles', { profile_ids: [...ids] });
    if (error) throw error;
    return data.map((row) => ({
      id: row.id,
      displayName: row.display_name,
      city: row.city,
      avatarUrl: row.avatar_path,
      rating: row.rating_average,
      completedServices: row.completed_services,
    }));
  }
}
