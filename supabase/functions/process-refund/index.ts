import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

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

    const { bookingId, reason } = await req.json();

    console.log('Processing refund for booking:', bookingId);

    // Fetch booking with payment info
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*, customer_addresses(currency)')
      .eq('id', bookingId)
      .eq('customer_id', user.id)
      .single();

    if (fetchError || !booking) {
      throw new Error('Booking not found');
    }

    if (!booking.payment_intent_id) {
      throw new Error('No payment found for this booking');
    }

    // Calculate refund based on cancellation policy
    const { data: refundData } = await supabase
      .rpc('calculate_cancellation_refund', {
        p_booking_id: bookingId,
        p_cancelled_by: user.id
      })
      .single();

    const refundAmount = (refundData as any)?.refund_amount || booking.total_estimate;
    const refundPercentage = (refundData as any)?.refund_percentage || 100;

    console.log('Refund calculation:', { refundAmount, refundPercentage });

    // Process Stripe refund
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe not configured');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    const refund = await stripe.refunds.create({
      payment_intent: booking.payment_intent_id,
      amount: Math.round(refundAmount * 100), // Convert to cents
      reason: 'requested_by_customer',
    });

    console.log('Stripe refund created:', refund.id);

    // Update booking status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        job_status: 'cancelled',
        payment_status: 'refunded',
      })
      .eq('id', bookingId);

    if (updateError) {
      throw new Error('Failed to update booking status');
    }

    // Record cancellation
    await supabase
      .from('cancellation_policies')
      .insert({
        booking_id: bookingId,
        cancelled_by: user.id,
        refund_amount: refundAmount,
        refund_percentage: refundPercentage,
        cancellation_reason: reason,
      });

    console.log('Refund processed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        refundId: refund.id,
        refundAmount: refundAmount,
        refundPercentage: refundPercentage,
        currency: booking.customer_addresses.currency
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('Error processing refund:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
