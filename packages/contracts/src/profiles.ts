import type { EntityId } from './common';

export type ProfileCompletion = 'incomplete' | 'pending_verification' | 'complete';

/** Public read model deliberately excludes contact details, addresses and verification documents. */
export interface PublicProfile {
  readonly id: EntityId;
  readonly displayName: string;
  readonly city: string;
  readonly avatarUrl: string | null;
  readonly rating: number | null;
  readonly completedServices: number;
}

/** Local form draft only. Verification flags and privileged roles cannot be edited here. */
export interface ProfileDraft {
  readonly displayName: string;
  readonly email: string;
  readonly city: string;
  readonly termsAccepted: boolean;
  readonly privacyAccepted: boolean;
}

/** Issued by trusted authentication/profile services in a later stage. Never derive from the draft. */
export interface AccountReadiness {
  readonly userId: EntityId;
  readonly completion: ProfileCompletion;
  readonly emailVerified: boolean;
  readonly hasAvatar: boolean;
}
