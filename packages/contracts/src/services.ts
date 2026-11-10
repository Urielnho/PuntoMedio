import type { EntityId, IsoDateTime, Money, PaymentMode } from './common';

export type MeetingStatus = 'created' | 'invited' | 'accepted' | 'point_selected' | 'in_progress' | 'completed' | 'cancelled';
export type JobStatus = 'published' | 'bidding' | 'assigned' | 'test_payment_confirmed' | 'pickup_in_progress' | 'picked_up' | 'delivery_in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
export type ProductPaymentStatus = 'declared_paid' | 'awaiting_confirmation' | 'not_managed';

export type ServiceSummary =
  | { readonly kind: 'meeting'; readonly serviceId: EntityId; readonly title: string; readonly status: MeetingStatus; readonly publicPlaceName: string | null; readonly updatedAt: IsoDateTime }
  | { readonly kind: 'job'; readonly serviceId: EntityId; readonly title: string; readonly status: JobStatus; readonly publicPlaceName: string | null; readonly updatedAt: IsoDateTime };

/** The product's purchase price is not part of PuntoMedio's service payment. */
export interface ServiceQuote {
  readonly mode: PaymentMode;
  readonly serviceFee: Money;
  readonly platformFee: Money;
  readonly optionalTip: Money;
  readonly total: Money;
}

/** No travel duration exists on the geographic-distance fallback. */
export type TravelEstimate =
  | { readonly method: 'route'; readonly distanceMeters: number; readonly approximateDurationSeconds: number }
  | { readonly method: 'geographic_distance'; readonly approximateDistanceMeters: number };

export interface MeetingPointSummary {
  readonly id: EntityId;
  readonly name: string;
  readonly category: string;
  readonly addressLabel: string;
  readonly city: string;
}

export interface MeetingSuggestion {
  readonly point: MeetingPointSummary;
  readonly rank: 1 | 2 | 3;
  readonly participantOne: TravelEstimate;
  readonly participantTwo: TravelEstimate;
}
