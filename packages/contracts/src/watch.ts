import type { EntityId, IsoDateTime, Money } from './common';
import type { ProfileCompletion } from './profiles';
import type { ServiceSummary } from './services';

export const WATCH_PROTOCOL_VERSION = 1 as const;

/** Sanitized presentation state. No passwords, tokens, codes or private coordinates. */
export interface WatchSnapshot {
  readonly version: 1;
  readonly hasSession: boolean;
  readonly profileCompletion: ProfileCompletion;
  readonly services: readonly ServiceSummary[];
  readonly unreadNotificationCount: number;
  readonly earningsSummary: { readonly mode: 'simulated'; readonly total: Money } | null;
}

export interface WatchStateEnvelope {
  readonly kind: 'state';
  readonly authorityDeviceId: string;
  readonly sequence: number;
  readonly snapshot: WatchSnapshot;
}

/** Intent only. The backend must authorize and confirm every transition. */
export interface WatchCommand {
  readonly version: 1;
  readonly commandId: string;
  readonly serviceId: EntityId;
  readonly action: 'mark_arrival' | 'request_pickup_confirmation' | 'request_delivery_confirmation' | 'refresh';
  readonly expectedRevision: number;
  readonly createdAt: IsoDateTime;
}
