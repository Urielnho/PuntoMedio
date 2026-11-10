export type ApproximateOrigin = { readonly latitude: number; readonly longitude: number };

export interface RouteProvider {
  readonly configured: boolean;
  estimate(origin: ApproximateOrigin, destination: ApproximateOrigin): Promise<{ readonly distanceMeters: number; readonly durationSeconds: number }>;
}

/** No provider has been approved. Geographic fallback is calculated on the server without durations. */
export const unavailableRouteProvider: RouteProvider = {
  configured: false,
  async estimate() { throw new Error('route_provider_unavailable'); },
};
