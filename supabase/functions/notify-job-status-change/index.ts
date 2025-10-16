import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StatusChangePayload {
  booking_id: string;
  old_status: string;
  new_status: string;
  customer_id: string;
  provider_id: string;
}

const getStatusNotificationContent = (status: string, role: 'customer' | 'provider') => {
  const content: Record<string, { customer: any; provider: any }> = {
    confirmed: {
      customer: {
        title: '✅ Booking Confirmed',
        body: 'Your cleaning service has been confirmed by the provider',
        target_url: '/customer/my-bookings'
      },
      provider: {
        title: '📋 Job Confirmed',
        body: 'You confirmed a new cleaning job',
        target_url: '/provider/jobs'
      }
    },
    on_the_way: {
      customer: {
        title: '🚗 Provider On The Way',
        body: 'Your cleaner is heading to your location',
        target_url: '/customer/my-bookings'
      },
      provider: {
        title: '🚗 Heading to Job',
        body: 'You marked yourself as on the way',
        target_url: '/provider/jobs'
      }
    },
    arrived: {
      customer: {
        title: '📍 Provider Arrived',
        body: 'Your cleaner has arrived at your location',
        target_url: '/customer/my-bookings'
      },
      provider: {
        title: '📍 Arrived at Location',
        body: 'You marked yourself as arrived',
        target_url: '/provider/jobs'
      }
    },
    in_progress: {
      customer: {
        title: '🧹 Cleaning Started',
        body: 'Your cleaning service has started',
        target_url: '/customer/my-bookings'
      },
      provider: {
        title: '🧹 Job Started',
        body: 'You started the cleaning job',
        target_url: '/provider/jobs'
      }
    },
    completed: {
      customer: {
        title: '✨ Service Completed',
        body: 'Your cleaning service is complete! Please leave a review',
        target_url: '/customer/my-bookings'
      },
      provider: {
        title: '💰 Job Completed',
        body: 'Great work! Your earnings have been updated',
        target_url: '/provider/wallet'
      }
    },
    cancelled: {
      customer: {
        title: '❌ Booking Cancelled',
        body: 'Your booking has been cancelled',
        target_url: '/customer/my-bookings'
      },
      provider: {
        title: '❌ Job Cancelled',
        body: 'A job has been cancelled',
        target_url: '/provider/jobs'
      }
    }
  };

  return content[status]?.[role] || {
    title: 'Job Status Update',
    body: `Job status changed to ${status}`,
    target_url: role === 'customer' ? '/customer/my-bookings' : '/provider/jobs'
  };
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: StatusChangePayload = await req.json();
    console.log('Job status change:', payload);

    const { booking_id, new_status, customer_id, provider_id } = payload;

    // Get customer notification content
    const customerContent = getStatusNotificationContent(new_status, 'customer');
    
    // Get provider notification content  
    const providerContent = getStatusNotificationContent(new_status, 'provider');

    // Send notification to customer
    const { error: customerNotifError } = await supabase.functions.invoke('send-push-notification', {
      body: {
        user_ids: [customer_id],
        title: customerContent.title,
        body: customerContent.body,
        target_url: customerContent.target_url,
        icon: 'https://clinlix.com/assets/logo-clinlix-BphsOeP6.png',
        tag: `booking-${booking_id}`
      }
    });

    if (customerNotifError) {
      console.error('Error sending customer notification:', customerNotifError);
    }

    // Send notification to provider if assigned
    if (provider_id) {
      const { error: providerNotifError } = await supabase.functions.invoke('send-push-notification', {
        body: {
          user_ids: [provider_id],
          title: providerContent.title,
          body: providerContent.body,
          target_url: providerContent.target_url,
          icon: 'https://clinlix.com/assets/logo-clinlix-BphsOeP6.png',
          tag: `booking-${booking_id}`
        }
      });

      if (providerNotifError) {
        console.error('Error sending provider notification:', providerNotifError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notifications sent' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in notify-job-status-change:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
