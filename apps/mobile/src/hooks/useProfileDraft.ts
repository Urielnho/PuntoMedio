import { useContext } from 'react';
import { ProfileDraftContext } from '../state/ProfileDraftProvider';

export function useProfileDraft() {
  const state = useContext(ProfileDraftContext);
  if (!state) throw new Error('ProfileDraftProvider is required');
  return state;
}
