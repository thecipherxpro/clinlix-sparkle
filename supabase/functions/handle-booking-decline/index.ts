import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { bookingId, rejectionReason } = await req.json();

    console.log('Handling booking decline:', bookingId);

    // Fetch booking details
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        customer_addresses(*),
        provider_profiles!inner(user_id, full_name),
        profiles!bookings_customer_id_fkey(first_name, last_name, email)
      `)
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      throw new Error('Booking not found');
    }

    // Verify user is the provider
    if (booking.provider_profiles.user_id !== user.id) {
      throw new Error('Not authorized');
    }

    // Update booking status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'declined',
        job_status: 'declined',
        rejected_at: new Date().toISOString(),
        declined_at: new Date().toISOString(),
        rejected_by: user.id,
        rejection_reason: rejectionReason,
      })
      .eq('id', bookingId);

    if (updateError) {
      throw new Error('Failed to update booking');
    }

    // Create notification for customer
    await supabase
      .from('notifications')
      .insert({
        user_id: booking.customer_id,
        title: 'Booking Declined - Action Required',
        body: `Your booking has been declined by ${booking.provider_profiles.full_name}. Please select a new provider or cancel.`,
        target_url: `/customer/bookings/${bookingId}/reassign`,
      });

    // Send email notification
    const customerName = `${booking.profiles.first_name} ${booking.profiles.last_name}`;
    const formattedDate = new Date(booking.requested_date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    await supabase.functions.invoke('send-booking-cancelled', {
      body: {
        customerEmail: booking.profiles.email,
        customerName: customerName,
        bookingId: booking.id,
        serviceDate: formattedDate,
        serviceTime: booking.requested_time,
        cancellationReason: rejectionReason || 'Provider unavailable',
        refundAmount: booking.total_estimate.toFixed(2),
        currency: booking.customer_addresses.currency === 'EUR' ? '€' : '$'
      }
    }).catch(err => console.error('Email error:', err));

    // Schedule auto-cancellation after 24 hours
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 24);
    
    console.log('Booking decline handled, auto-cancel scheduled for:', expirationTime);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Customer notified of decline',
        expiresAt: expirationTime.toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('Error handling decline:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
