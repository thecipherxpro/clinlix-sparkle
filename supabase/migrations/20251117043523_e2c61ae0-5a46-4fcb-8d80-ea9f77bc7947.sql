-- Add field to track when booking will auto-cancel after decline
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS declined_at TIMESTAMP WITH TIME ZONE;

-- Add comment to explain the field
COMMENT ON COLUMN public.bookings.declined_at IS 'Timestamp when booking was declined. Used to calculate 24h auto-cancellation deadline.';
