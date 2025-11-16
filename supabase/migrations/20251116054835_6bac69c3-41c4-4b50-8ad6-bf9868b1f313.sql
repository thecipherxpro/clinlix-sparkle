-- Create messages table for chat functionality
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_status BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Users can view messages for their bookings"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = messages.booking_id
      AND (
        b.customer_id = auth.uid() OR
        b.provider_id IN (
          SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can send messages for their bookings"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = messages.booking_id
      AND (
        b.customer_id = auth.uid() OR
        b.provider_id IN (
          SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can update their own messages"
  ON public.messages FOR UPDATE
  USING (sender_id = auth.uid());

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create cancellation_policies table
CREATE TABLE IF NOT EXISTS public.cancellation_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
  cancelled_by UUID NOT NULL REFERENCES auth.users(id),
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ DEFAULT now(),
  refund_amount NUMERIC DEFAULT 0,
  refund_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on cancellation_policies
ALTER TABLE public.cancellation_policies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cancellation_policies
CREATE POLICY "Users can view cancellations for their bookings"
  ON public.cancellation_policies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = cancellation_policies.booking_id
      AND (
        b.customer_id = auth.uid() OR
        b.provider_id IN (
          SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create cancellations for their bookings"
  ON public.cancellation_policies FOR INSERT
  WITH CHECK (
    cancelled_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = cancellation_policies.booking_id
      AND (
        b.customer_id = auth.uid() OR
        b.provider_id IN (
          SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Add rejection tracking to bookings
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES auth.users(id);

-- Create function to calculate refund based on cancellation time
CREATE OR REPLACE FUNCTION calculate_cancellation_refund(
  p_booking_id UUID,
  p_cancelled_by UUID
)
RETURNS TABLE(refund_amount NUMERIC, refund_percentage INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking RECORD;
  v_hours_until_service INTEGER;
  v_refund_pct INTEGER;
  v_refund_amt NUMERIC;
BEGIN
  -- Get booking details
  SELECT 
    requested_date,
    requested_time,
    total_estimate,
    customer_id,
    provider_id
  INTO v_booking
  FROM bookings
  WHERE id = p_booking_id;

  -- Calculate hours until service
  v_hours_until_service := EXTRACT(EPOCH FROM (
    (v_booking.requested_date || ' ' || v_booking.requested_time)::TIMESTAMP - NOW()
  )) / 3600;

  -- Determine refund percentage based on cancellation policy
  IF v_hours_until_service >= 48 THEN
    v_refund_pct := 100; -- Full refund if cancelled 48+ hours before
  ELSIF v_hours_until_service >= 24 THEN
    v_refund_pct := 50; -- 50% refund if cancelled 24-48 hours before
  ELSIF v_hours_until_service >= 12 THEN
    v_refund_pct := 25; -- 25% refund if cancelled 12-24 hours before
  ELSE
    v_refund_pct := 0; -- No refund if cancelled less than 12 hours before
  END IF;

  -- Provider cancellations always get full refund for customer
  IF p_cancelled_by IN (
    SELECT user_id FROM provider_profiles WHERE id = v_booking.provider_id
  ) THEN
    v_refund_pct := 100;
  END IF;

  v_refund_amt := v_booking.total_estimate * v_refund_pct / 100;

  RETURN QUERY SELECT v_refund_amt, v_refund_pct;
END;
$$;

-- Create trigger to update message read status timestamp
CREATE OR REPLACE FUNCTION update_message_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_message_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_message_updated_at();