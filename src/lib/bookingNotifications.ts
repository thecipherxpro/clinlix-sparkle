import { sendPushNotification, NotificationTemplates } from './notificationHelper';

/**
 * Example: Send notification when a provider accepts a booking
 */
export const notifyBookingConfirmed = async (
  customerId: string,
  providerName: string
) => {
  const template = NotificationTemplates.bookingConfirmed(providerName);
  return await sendPushNotification({
    user_ids: [customerId],
    ...template,
  });
};

/**
 * Example: Send notification when a customer creates a new booking
 */
export const notifyNewJobRequest = async (
  providerId: string,
  customerName: string,
  address: string
) => {
  const template = NotificationTemplates.newJobRequest(customerName, address);
  return await sendPushNotification({
    user_ids: [providerId],
    ...template,
  });
};

/**
 * Example: Send notification when job is started
 */
export const notifyJobStarted = async (
  customerId: string,
  providerName: string
) => {
  const template = NotificationTemplates.jobStarted(providerName);
  return await sendPushNotification({
    user_ids: [customerId],
    ...template,
  });
};

/**
 * Example: Send notification when job is completed
 */
export const notifyJobCompleted = async (
  customerId: string,
  providerName: string
) => {
  const template = NotificationTemplates.jobCompleted(providerName);
  return await sendPushNotification({
    user_ids: [customerId],
    ...template,
  });
};

/**
 * Example: Send notification when booking is cancelled
 */
export const notifyBookingCancelled = async (
  userId: string,
  isCustomer: boolean
) => {
  const template = isCustomer 
    ? NotificationTemplates.bookingCancelled()
    : NotificationTemplates.bookingCancelledByCustomer('Customer');
    
  return await sendPushNotification({
    user_ids: [userId],
    ...template,
  });
};
