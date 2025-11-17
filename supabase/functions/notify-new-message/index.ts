import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MessagePayload {
  message_id: string;
  booking_id: string;
  sender_id: string;
  content: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: MessagePayload = await req.json();
    console.log('📨 New message notification payload:', payload);

    // Get booking details to find recipient
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('customer_id, provider_id')
      .eq('id', payload.booking_id)
      .single();

    if (bookingError) {
      console.error('❌ Error fetching booking:', bookingError);
      throw bookingError;
    }

    // Determine recipient (the person who didn't send the message)
    const recipientId = booking.customer_id === payload.sender_id 
      ? booking.provider_id 
      : booking.customer_id;

    if (!recipientId) {
      console.log('⚠️ No recipient found for message');
      return new Response(
        JSON.stringify({ error: 'No recipient found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get sender's profile for name
    const { data: senderProfile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', payload.sender_id)
      .single();

    if (profileError) {
      console.error('❌ Error fetching sender profile:', profileError);
      throw profileError;
    }

    const senderName = `${senderProfile.first_name} ${senderProfile.last_name}`;
    
    // Truncate message content for preview (max 100 chars)
    const messagePreview = payload.content.length > 100 
      ? payload.content.substring(0, 97) + '...' 
      : payload.content;

    // Create notification in database
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: recipientId,
        title: `💬 New message from ${senderName}`,
        body: messagePreview,
        target_url: `/customer/bookings/${payload.booking_id}`, // Will work for both portals
        read_status: false
      });

    if (notificationError) {
      console.error('❌ Error creating notification:', notificationError);
      throw notificationError;
    }

    console.log('✅ Notification created for user:', recipientId);

    // Send push notification
    try {
      const { data: pushData, error: pushError } = await supabase.functions.invoke(
        'send-push-notification',
        {
          body: {
            user_ids: [recipientId],
            title: `💬 ${senderName}`,
            body: messagePreview,
            target_url: `/customer/bookings/${payload.booking_id}`
          }
        }
      );

      if (pushError) {
        console.error('⚠️ Push notification failed (non-critical):', pushError);
      } else {
        console.log('✅ Push notification sent:', pushData);
      }
    } catch (pushError) {
      console.error('⚠️ Push notification error (non-critical):', pushError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        recipient_id: recipientId,
        message: 'Notification sent successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('❌ Error in notify-new-message function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});