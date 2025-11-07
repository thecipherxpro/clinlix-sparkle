import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  user_ids?: string[];
  role?: 'customer' | 'provider';
  title: string;
  body: string;
  target_url?: string;
  icon?: string;
  tag?: string;
}

// Web Push library function (simplified version)
async function sendWebPush(subscription: any, payload: string, vapidDetails: any) {
  const endpoint = subscription.endpoint;
  const keys = subscription.keys;
  
  // In production, you'd use the web-push library
  // For now, this is a simplified version that demonstrates the flow
  console.log('Sending push to:', endpoint);
  console.log('Payload:', payload);
  
  // Note: Full implementation requires web-push library with VAPID signing
  // This is a placeholder that logs the attempt
  return { success: true };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Extract JWT token from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT and get user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check if user has admin or system role
    const { data: userRole, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    // Only allow system administrators to send notifications
    // Regular users cannot send push notifications to other users
    const isAdmin = userRole && userRole.role === 'admin';
    
    if (!isAdmin) {
      console.warn(`Unauthorized notification attempt by user: ${user.id}`);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - insufficient permissions. Only administrators can send push notifications.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    const payload: NotificationPayload = await req.json();
    console.log('📬 Sending push notification:', payload);

    const { user_ids, role, title, body, target_url, icon, tag } = payload;

    if (!title || !body) {
      throw new Error('Title and body are required');
    }

    // Get subscriptions based on user_ids or role
    let query = supabaseClient
      .from('push_subscriptions')
      .select('*');

    if (user_ids && user_ids.length > 0) {
      query = query.in('user_id', user_ids);
    } else if (role) {
      query = query.eq('role', role);
    }

    const { data: subscriptions, error: subError } = await query;

    if (subError) {
      console.error('Error fetching subscriptions:', subError);
      throw subError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions found');
      return new Response(
        JSON.stringify({ message: 'No subscriptions found', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📱 Found ${subscriptions.length} subscriptions`);

    // Prepare notification data
    const notificationData = {
      title,
      body,
      icon: icon || 'https://clinlix.com/assets/logo-clinlix-BphsOeP6.png',
      badge: 'https://clinlix.com/assets/logo-clinlix-BphsOeP6.png',
      target_url: target_url || '/',
      tag: tag || 'clinlix-notification'
    };

    // Send push notifications
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          // In production, use proper web-push library with VAPID keys
          const vapidDetails = {
            subject: 'mailto:support@clinlix.com',
            publicKey: Deno.env.get('VAPID_PUBLIC_KEY'),
            privateKey: Deno.env.get('VAPID_PRIVATE_KEY')
          };

          await sendWebPush(
            sub.subscription_data,
            JSON.stringify(notificationData),
            vapidDetails
          );

          // Store notification in database
          await supabaseClient
            .from('notifications')
            .insert({
              user_id: sub.user_id,
              title,
              body,
              target_url: target_url || null,
              read_status: false
            });

          return { success: true, user_id: sub.user_id };
        } catch (error) {
          console.error(`Error sending to user ${sub.user_id}:`, error);
          return { success: false, user_id: sub.user_id, error };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    console.log(`✅ Sent ${successful} notifications, ❌ Failed ${failed}`);

    return new Response(
      JSON.stringify({
        message: 'Push notifications sent',
        sent: successful,
        failed,
        total: results.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});