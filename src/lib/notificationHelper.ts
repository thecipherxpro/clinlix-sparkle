import { supabase } from '@/integrations/supabase/client';

interface SendNotificationParams {
  user_ids?: string[];
  role?: 'customer' | 'provider';
  title: string;
  body: string;
  target_url?: string;
}

/**
 * Send push notifications to specific users or all users of a role
 * 
 * @example
 * // Send to specific users
 * await sendPushNotification({
 *   user_ids: [customerId],
 *   title: 'Booking Confirmed',
 *   body: 'Your cleaner has confirmed your booking.',
 *   target_url: '/customer/bookings'
 * });
 * 
 * @example
 * // Send to all providers
 * await sendPushNotification({
 *   role: 'provider',
 *   title: 'New Job Available',
 *   body: 'A new cleaning job is available in your area.',
 *   target_url: '/provider/jobs'
 * });
 */
export const sendPushNotification = async (params: SendNotificationParams) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-push-notification', {
      body: params,
    });

    if (error) {
      console.error('Failed to send push notification:', error);
      return { success: false, error };
    }

    console.log('✅ Push notification sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error };
  }
};

/**
 * Notification templates for common events
 */
export const NotificationTemplates = {
  // Customer notifications
  bookingConfirmed: (providerName: string) => ({
    title: 'Booking Confirmed',
    body: `Your cleaner ${providerName} has confirmed your booking.`,
    target_url: '/customer/bookings',
  }),
  
  jobStarted: (providerName: string) => ({
    title: 'Job Started',
    body: `${providerName} has started your cleaning service.`,
    target_url: '/customer/bookings',
  }),
  
  jobCompleted: (providerName: string) => ({
    title: 'Job Completed',
    body: `${providerName} has completed your cleaning. Please leave a review!`,
    target_url: '/customer/bookings',
  }),
  
  bookingCancelled: () => ({
    title: 'Booking Cancelled',
    body: 'Your booking has been cancelled.',
    target_url: '/customer/bookings',
  }),

  // Provider notifications
  newJobRequest: (customerName: string, address: string) => ({
    title: 'New Job Request',
    body: `New cleaning request from ${customerName} at ${address}. Tap to review and accept.`,
    target_url: '/provider/jobs',
  }),
  
  bookingUpdated: (customerName: string) => ({
    title: 'Booking Updated',
    body: `${customerName} has updated their booking details.`,
    target_url: '/provider/jobs',
  }),
  
  bookingCancelledByCustomer: (customerName: string) => ({
    title: 'Booking Cancelled',
    body: `${customerName} has cancelled their booking.`,
    target_url: '/provider/jobs',
  }),
};
