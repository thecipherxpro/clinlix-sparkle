import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushNotificationRequest {
  user_ids?: string[];
  role?: 'customer' | 'provider';
  title: string;
  body: string;
  target_url?: string;
}

interface PushSubscription {
  id: string;
  user_id: string;
  role: string;
  subscription_data: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY') || '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') || '';

async function sendWebPushNotification(
  subscription: PushSubscription['subscription_data'],
  payload: { title: string; body: string; target_url?: string }
) {
  const vapidHeaders = {
    'Content-Type': 'application/json',
    'TTL': '86400',
  };

  try {
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: vapidHeaders,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Failed to send push notification:', await response.text());
    }
    
    return response.ok;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestData: PushNotificationRequest = await req.json();
    const { user_ids, role, title, body, target_url } = requestData;

    if (!title || !body) {
      return new Response(
        JSON.stringify({ error: 'Title and body are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build query
    let query = supabase
      .from('push_subscriptions')
      .select('*');

    if (user_ids && user_ids.length > 0) {
      query = query.in('user_id', user_ids);
    }

    if (role) {
      query = query.eq('role', role);
    }

    const { data: subscriptions, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch subscriptions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No subscriptions found', sent: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send push notifications
    const pushPromises = subscriptions.map((sub) =>
      sendWebPushNotification(sub.subscription_data, { title, body, target_url })
    );

    const results = await Promise.allSettled(pushPromises);
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;

    // Store notifications in database for notification center
    const notificationInserts = subscriptions.map((sub) => ({
      user_id: sub.user_id,
      title,
      body,
      target_url,
      read_status: false,
    }));

    const { error: insertError } = await supabase
      .from('notifications')
      .insert(notificationInserts);

    if (insertError) {
      console.error('Error storing notifications:', insertError);
    }

    console.log(`✅ Sent ${successCount}/${subscriptions.length} push notifications`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        total: subscriptions.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-push-notification function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
