export type Json = string | number | boolean | null | { readonly [key: string]: Json | undefined } | readonly Json[];

export type Database = {
  public: {
    Tables: {
      profiles: { Row: { id: string; display_name: string | null; city: string | null; avatar_path: string | null; phone_verified: boolean; email_verified: boolean; terms_accepted_at: string | null; privacy_accepted_at: string | null; status: 'incomplete' | 'pending_verification' | 'complete' | 'suspended'; completed_services: number; rating_average: number | null; rating_count: number; created_at: string; updated_at: string }; Insert: never; Update: never; Relationships: [] };
      courier_profiles: { Row: { user_id: string; enabled: boolean; rules_accepted_at: string | null; suspended_at: string | null; created_at: string; updated_at: string }; Insert: never; Update: never; Relationships: [] };
      reviews: { Row: { id: string; subject_id: string; author_id: string; rating: number; comment: string | null; created_at: string }; Insert: never; Update: never; Relationships: [] };
      reports: { Row: { id: string; reporter_id: string; subject_id: string | null; category: string; details: string; status: 'open' | 'reviewing' | 'resolved' | 'dismissed'; created_at: string; updated_at: string }; Insert: { reporter_id: string; subject_id?: string | null; category: string; details: string }; Update: never; Relationships: [] };
      user_blocks: { Row: { blocker_id: string; blocked_id: string; created_at: string }; Insert: { blocker_id: string; blocked_id: string }; Update: never; Relationships: [] };
      meetings: { Row: { id: string; creator_id: string; title: string; status: 'created' | 'invited' | 'accepted' | 'point_selected' | 'in_progress' | 'completed' | 'cancelled'; selected_point_id: string | null; revision: number; created_at: string; updated_at: string }; Insert: never; Update: never; Relationships: [] };
      meeting_participants: { Row: { meeting_id: string; user_id: string; status: 'invited' | 'accepted' | 'declined'; accepted_point_at: string | null; arrived_at: string | null; completed_at: string | null; created_at: string; updated_at: string }; Insert: never; Update: never; Relationships: [] };
      meeting_points: { Row: { id: string; name: string; category: string; address_label: string; latitude: number; longitude: number; city: string; active: boolean; created_at: string; updated_at: string }; Insert: never; Update: never; Relationships: [] };
      meeting_point_suggestions: { Row: { meeting_id: string; point_id: string; rank: number; method: 'route' | 'geographic_distance'; participant_one_distance_m: number; participant_two_distance_m: number; participant_one_duration_s: number | null; participant_two_duration_s: number | null; created_at: string }; Insert: never; Update: never; Relationships: [] };
      jobs: { Row: { id: string; requester_id: string; title: string; description: string; category: string; declared_product_value_minor: number | null; currency: 'MXN'; product_payment_status: 'declared_paid' | 'awaiting_confirmation' | 'not_managed'; pickup_label: string; delivery_label: string; status: 'published' | 'bidding' | 'assigned' | 'test_payment_confirmed' | 'pickup_in_progress' | 'picked_up' | 'delivery_in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed'; revision: number; created_at: string; updated_at: string }; Insert: never; Update: never; Relationships: [] };
      bids: { Row: { id: string; job_id: string; courier_id: string; proposed_fee_minor: number; currency: 'MXN'; note: string | null; status: 'active' | 'accepted' | 'rejected' | 'withdrawn'; created_at: string; updated_at: string }; Insert: never; Update: never; Relationships: [] };
      job_assignments: { Row: { job_id: string; bid_id: string; courier_id: string; assigned_by: string; assigned_at: string }; Insert: never; Update: never; Relationships: [] };
      conversations: { Row: { id: string; service_kind: 'meeting' | 'job'; meeting_id: string | null; job_id: string | null; created_at: string }; Insert: never; Update: never; Relationships: [] };
      messages: { Row: { id: string; conversation_id: string; sender_id: string; body: string | null; attachment_path: string | null; created_at: string; edited_at: string | null }; Insert: never; Update: never; Relationships: [] };
      notifications: { Row: { id: string; user_id: string; kind: string; title: string; body: string; service_kind: 'meeting' | 'job' | null; service_id: string | null; read_at: string | null; created_at: string }; Insert: never; Update: { read_at?: string | null }; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: {
      update_my_profile: { Args: { p_display_name: string; p_city: string; p_avatar_path: string | null; p_accept_terms?: boolean; p_accept_privacy?: boolean }; Returns: Database['public']['Tables']['profiles']['Row'] };
      get_public_profiles: { Args: { profile_ids: string[] }; Returns: Array<{ id: string; display_name: string; city: string; avatar_path: string | null; rating_average: number | null; completed_services: number }> };
      set_courier_enabled: { Args: { p_enabled: boolean; p_accept_rules?: boolean }; Returns: Database['public']['Tables']['courier_profiles']['Row'] };
      assign_job_bid: { Args: { p_job_id: string; p_bid_id: string; p_expected_revision: number }; Returns: Json };
      confirm_simulated_payment: { Args: { p_job_id: string; p_platform_fee_minor: number; p_optional_tip_minor: number; p_idempotency_key: string; p_expected_revision: number }; Returns: Json };
      issue_handoff_code: { Args: { p_job_id: string; p_stage: 'pickup' | 'delivery' }; Returns: string };
      confirm_handoff: { Args: { p_job_id: string; p_stage: 'pickup' | 'delivery'; p_code: string; p_expected_revision: number }; Returns: Json };
      create_meeting: { Args: { p_title: string; p_latitude: number; p_longitude: number }; Returns: Database['public']['Tables']['meetings']['Row'] };
      create_meeting_invitation: { Args: { p_meeting_id: string; p_expected_revision: number }; Returns: string };
      accept_meeting_invitation: { Args: { p_token: string; p_latitude: number; p_longitude: number }; Returns: Database['public']['Tables']['meetings']['Row'] };
      generate_geographic_suggestions: { Args: { p_meeting_id: string; p_expected_revision: number }; Returns: Database['public']['Tables']['meeting_point_suggestions']['Row'][] };
      accept_meeting_point: { Args: { p_meeting_id: string; p_point_id: string; p_expected_revision: number }; Returns: Database['public']['Tables']['meetings']['Row'] };
      mark_meeting_arrival: { Args: { p_meeting_id: string; p_expected_revision: number }; Returns: Database['public']['Tables']['meetings']['Row'] };
      complete_meeting: { Args: { p_meeting_id: string; p_expected_revision: number }; Returns: Database['public']['Tables']['meetings']['Row'] };
      cancel_meeting: { Args: { p_meeting_id: string; p_expected_revision: number }; Returns: Database['public']['Tables']['meetings']['Row'] };
      create_job: { Args: { p_title: string; p_description: string; p_category: string; p_declared_product_value_minor: number | null; p_product_payment_status: 'declared_paid' | 'awaiting_confirmation' | 'not_managed'; p_pickup_label: string; p_delivery_label: string; p_pickup_latitude: number; p_pickup_longitude: number; p_delivery_latitude: number; p_delivery_longitude: number; p_pickup_private_note?: string | null; p_delivery_private_note?: string | null }; Returns: Database['public']['Tables']['jobs']['Row'] };
      place_job_bid: { Args: { p_job_id: string; p_proposed_fee_minor: number; p_note: string | null; p_expected_revision: number }; Returns: Database['public']['Tables']['bids']['Row'] };
      withdraw_job_bid: { Args: { p_bid_id: string; p_expected_revision: number }; Returns: Database['public']['Tables']['bids']['Row'] };
      confirm_product_payment: { Args: { p_job_id: string; p_expected_revision: number }; Returns: Database['public']['Tables']['jobs']['Row'] };
      start_job_pickup: { Args: { p_job_id: string; p_expected_revision: number }; Returns: Database['public']['Tables']['jobs']['Row'] };
      start_job_delivery: { Args: { p_job_id: string; p_expected_revision: number }; Returns: Database['public']['Tables']['jobs']['Row'] };
      complete_job: { Args: { p_job_id: string; p_expected_revision: number }; Returns: Database['public']['Tables']['jobs']['Row'] };
      cancel_job: { Args: { p_job_id: string; p_expected_revision: number }; Returns: Database['public']['Tables']['jobs']['Row'] };
      get_job_private_location: { Args: { p_job_id: string }; Returns: Array<{ pickup_latitude: number; pickup_longitude: number; delivery_latitude: number; delivery_longitude: number; pickup_private_note: string | null; delivery_private_note: string | null }> };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
