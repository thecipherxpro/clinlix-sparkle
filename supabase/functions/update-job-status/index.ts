import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Valid state transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  'pending': ['confirmed', 'declined'],
  'confirmed': ['on_the_way'],
  'on_the_way': ['arrived'],
  'arrived': ['started'],
  'started': ['completed'],
  'completed': [],
  'declined': []
};

interface StatusUpdateRequest {
  bookingId: string;
  newStatus: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify user is authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { bookingId, newStatus }: StatusUpdateRequest = await req.json();

    console.log('Updating job status:', bookingId, 'to', newStatus);

    // Fetch current booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*, provider_profiles!inner(user_id)')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      throw new Error('Booking not found');
    }

    // Verify user is the provider for this booking
    if (booking.provider_profiles.user_id !== user.id) {
      throw new Error('Not authorized to update this booking');
    }

    const currentStatus = booking.job_status;

    // Validate state transition
    const validNextStates = VALID_TRANSITIONS[currentStatus] || [];
    if (!validNextStates.includes(newStatus)) {
      throw new Error(
        `Invalid state transition from '${currentStatus}' to '${newStatus}'. Valid transitions: ${validNextStates.join(', ')}`
      );
    }

    // Prevent starting jobs before scheduled date
    if (newStatus === 'started' || newStatus === 'on_the_way') {
      const requestedDate = new Date(booking.requested_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      requestedDate.setHours(0, 0, 0, 0);

      if (requestedDate > today) {
        throw new Error('Cannot start job before the scheduled date');
      }
    }

    // Build update object based on status
    const updates: any = { job_status: newStatus };

    if (newStatus === 'confirmed') {
      updates.confirmed_at = new Date().toISOString();
    } else if (newStatus === 'started') {
      updates.started_at = new Date().toISOString();
    } else if (newStatus === 'completed') {
      updates.completed_at = new Date().toISOString();
      updates.total_final = booking.total_estimate;
    }

    // Update booking
    const { error: updateError } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error('Failed to update booking status');
    }

    console.log('Job status updated successfully');

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('Error in update-job-status:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to update job status' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
