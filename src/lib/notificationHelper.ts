import { supabase } from '@/integrations/supabase/client';

interface SendNotificationParams {
  user_ids?: string[];
  role?: 'customer' | 'provider';
  title: string;
  body: string;
  target_url?: string;
  icon?: string;
}

export const sendPushNotification = async (params: SendNotificationParams) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-push-notification', {
      body: params
    });

    if (error) throw error;

    console.log('✅ Notification sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    return { success: false, error };
  }
};

// Notification Templates for common scenarios
export const NotificationTemplates = {
  bookingConfirmed: (customerName: string, providerName: string) => ({
    title: '🧹 Booking Confirmed',
    body: `Your cleaner ${providerName} has confirmed your booking.`,
    target_url: '/customer/bookings'
  }),

  newJobRequest: (customerName: string, address: string) => ({
    title: '💼 New Job Request',
    body: `New cleaning request from ${customerName} at ${address}.`,
    target_url: '/provider/jobs'
  }),

  jobStarted: (providerName: string) => ({
    title: '🚀 Job Started',
    body: `${providerName} has started your cleaning service.`,
    target_url: '/customer/bookings'
  }),

  jobCompleted: (providerName: string) => ({
    title: '✅ Job Completed',
    body: `${providerName} has completed your service. Leave a review!`,
    target_url: '/customer/bookings'
  }),

  bookingCancelled: (customerName: string) => ({
    title: '❌ Booking Cancelled',
    body: `${customerName} has cancelled the booking.`,
    target_url: '/provider/jobs'
  }),

  paymentReceived: (amount: number, currency: string) => ({
    title: '💰 Payment Received',
    body: `You've earned ${currency === 'EUR' ? '€' : '$'}${amount.toFixed(2)}.`,
    target_url: '/provider/wallet'
  }),

  newMessage: (senderName: string, messagePreview: string) => ({
    title: `💬 New message from ${senderName}`,
    body: messagePreview,
    target_url: '/customer/bookings'
  })
};

// Example usage functions
export const notifyBookingConfirmed = async (customerId: string, customerName: string, providerName: string) => {
  const template = NotificationTemplates.bookingConfirmed(customerName, providerName);
  return await sendPushNotification({
    user_ids: [customerId],
    ...template
  });
};

export const notifyNewJobRequest = async (providerId: string, customerName: string, address: string) => {
  const template = NotificationTemplates.newJobRequest(customerName, address);
  return await sendPushNotification({
    user_ids: [providerId],
    ...template
  });
};

export const notifyJobStarted = async (customerId: string, providerName: string) => {
  const template = NotificationTemplates.jobStarted(providerName);
  return await sendPushNotification({
    user_ids: [customerId],
    ...template
  });
};

export const notifyJobCompleted = async (customerId: string, providerName: string) => {
  const template = NotificationTemplates.jobCompleted(providerName);
  return await sendPushNotification({
    user_ids: [customerId],
    ...template
  });
};

export const notifyNewMessage = async (recipientId: string, senderName: string, messagePreview: string) => {
  const template = NotificationTemplates.newMessage(senderName, messagePreview);
  return await sendPushNotification({
    user_ids: [recipientId],
    ...template
  });
};