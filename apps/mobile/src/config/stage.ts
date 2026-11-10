/** Stage 5 prepares jobs; activation still requires a reviewed independent Supabase project. */
export const stage = Object.freeze({
  mode: 'jobs-prepared',
  integrationsPrepared: true,
  runtimeRequiresConfiguration: true,
  serviceMutationsEnabled: false,
  paymentMode: 'simulated',
} as const);
