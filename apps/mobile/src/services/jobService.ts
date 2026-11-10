import { getSupabaseRuntime } from '../integrations/supabase/runtime';

function client() {
  const value = getSupabaseRuntime().client;
  if (!value) throw new Error('integration_unavailable');
  return value;
}

export type CreateJobInput = {
  title: string;
  description: string;
  category: string;
  declaredValueMinor: number | null;
  productPaymentStatus: 'declared_paid' | 'awaiting_confirmation' | 'not_managed';
  pickupLabel: string;
  deliveryLabel: string;
  pickupLatitude: number;
  pickupLongitude: number;
  deliveryLatitude: number;
  deliveryLongitude: number;
  pickupPrivateNote?: string;
  deliveryPrivateNote?: string;
};

export const jobService = {
  async list() {
    const { data, error } = await client().from('jobs').select('*').order('updated_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async listMine() {
    const connection = client();
    const { data: auth, error: authError } = await connection.auth.getUser();
    if (authError || !auth.user) throw authError ?? new Error('authentication_required');
    const [jobs, assignments, bids] = await Promise.all([
      connection.from('jobs').select('*').order('updated_at', { ascending: false }),
      connection.from('job_assignments').select('*').eq('courier_id', auth.user.id),
      connection.from('bids').select('*').eq('courier_id', auth.user.id),
    ]);
    if (jobs.error) throw jobs.error;
    if (assignments.error) throw assignments.error;
    if (bids.error) throw bids.error;
    const related = new Set([...assignments.data.map((item) => item.job_id), ...bids.data.map((item) => item.job_id)]);
    return jobs.data.filter((job) => job.requester_id === auth.user.id || related.has(job.id));
  },
  async get(id: string) {
    const connection = client();
    const [job, bids, assignments] = await Promise.all([
      connection.from('jobs').select('*').eq('id', id).single(),
      connection.from('bids').select('*').eq('job_id', id).order('proposed_fee_minor'),
      connection.from('job_assignments').select('*').eq('job_id', id),
    ]);
    if (job.error) throw job.error;
    if (bids.error) throw bids.error;
    if (assignments.error) throw assignments.error;
    const courierIds = bids.data.map((bid) => bid.courier_id);
    const profiles = courierIds.length
      ? await connection.rpc('get_public_profiles', { profile_ids: courierIds })
      : { data: [], error: null };
    if (profiles.error) throw profiles.error;
    return { job: job.data, bids: bids.data, assignments: assignments.data, profiles: profiles.data };
  },
  async create(input: CreateJobInput) {
    const { data, error } = await client().rpc('create_job', {
      p_title: input.title,
      p_description: input.description,
      p_category: input.category,
      p_declared_product_value_minor: input.declaredValueMinor,
      p_product_payment_status: input.productPaymentStatus,
      p_pickup_label: input.pickupLabel,
      p_delivery_label: input.deliveryLabel,
      p_pickup_latitude: input.pickupLatitude,
      p_pickup_longitude: input.pickupLongitude,
      p_delivery_latitude: input.deliveryLatitude,
      p_delivery_longitude: input.deliveryLongitude,
      p_pickup_private_note: input.pickupPrivateNote ?? null,
      p_delivery_private_note: input.deliveryPrivateNote ?? null,
    });
    if (error) throw error;
    return data;
  },
  async bid(jobId: string, feeMinor: number, note: string, revision: number) { const { data, error } = await client().rpc('place_job_bid', { p_job_id: jobId, p_proposed_fee_minor: feeMinor, p_note: note || null, p_expected_revision: revision }); if (error) throw error; return data; },
  async assign(jobId: string, bidId: string, revision: number) { const { data, error } = await client().rpc('assign_job_bid', { p_job_id: jobId, p_bid_id: bidId, p_expected_revision: revision }); if (error) throw error; return data; },
  async confirmProduct(jobId: string, revision: number) { const { data, error } = await client().rpc('confirm_product_payment', { p_job_id: jobId, p_expected_revision: revision }); if (error) throw error; return data; },
  async startPickup(jobId: string, revision: number) { const { data, error } = await client().rpc('start_job_pickup', { p_job_id: jobId, p_expected_revision: revision }); if (error) throw error; return data; },
  async startDelivery(jobId: string, revision: number) { const { data, error } = await client().rpc('start_job_delivery', { p_job_id: jobId, p_expected_revision: revision }); if (error) throw error; return data; },
  async issueCode(jobId: string, stage: 'pickup' | 'delivery') { const { data, error } = await client().rpc('issue_handoff_code', { p_job_id: jobId, p_stage: stage }); if (error) throw error; return data; },
  async confirmCode(jobId: string, stage: 'pickup' | 'delivery', code: string, revision: number) { const { data, error } = await client().rpc('confirm_handoff', { p_job_id: jobId, p_stage: stage, p_code: code, p_expected_revision: revision }); if (error) throw error; if (!data) throw new Error('invalid_handoff_code'); return data; },
  async complete(jobId: string, revision: number) { const { data, error } = await client().rpc('complete_job', { p_job_id: jobId, p_expected_revision: revision }); if (error) throw error; return data; },
  async cancel(jobId: string, revision: number) { const { data, error } = await client().rpc('cancel_job', { p_job_id: jobId, p_expected_revision: revision }); if (error) throw error; return data; },
};
