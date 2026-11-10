export type EntityId = string;
export type IsoDateTime = string;

/** Integer minor currency units, validated by the backend before any financial operation. */
export interface Money {
  readonly currency: 'MXN';
  readonly amountMinor: number;
}

export type PaymentMode = 'simulated';

export interface ApiProblem {
  readonly code: 'not_configured' | 'unauthenticated' | 'profile_incomplete' | 'forbidden' | 'unavailable' | 'conflict';
  readonly message: string;
  readonly retryable: boolean;
}
