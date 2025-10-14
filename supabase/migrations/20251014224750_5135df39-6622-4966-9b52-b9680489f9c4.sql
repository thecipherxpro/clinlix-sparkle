-- Add addon_amount column to provider_wallet
ALTER TABLE public.provider_wallet ADD COLUMN IF NOT EXISTS addon_amount NUMERIC DEFAULT 0;

-- Create function to calculate and create wallet entry when job completes
CREATE OR REPLACE FUNCTION public.create_provider_wallet_entry()
RETURNS TRIGGER AS $$
DECLARE
  v_provider_id UUID;
  v_package_price NUMERIC;
  v_addon_total NUMERIC := 0;
  v_overtime_amount NUMERIC;
  v_total_earned NUMERIC;
  v_platform_fee NUMERIC;
  v_payout_due NUMERIC;
BEGIN
  -- Only proceed if status changed to 'completed'
  IF NEW.job_status = 'completed' AND (OLD.job_status IS NULL OR OLD.job_status != 'completed') THEN
    
    -- Get provider_id
    v_provider_id := NEW.provider_id;
    
    -- Get package price from the address's package
    SELECT cp.one_time_price INTO v_package_price
    FROM public.customer_addresses ca
    JOIN public.cleaning_packages cp ON ca.package_code = cp.package_code
    WHERE ca.id = NEW.address_id;
    
    -- Calculate addon total if any
    IF NEW.addon_ids IS NOT NULL AND array_length(NEW.addon_ids, 1) > 0 THEN
      SELECT COALESCE(SUM(price), 0) INTO v_addon_total
      FROM public.cleaning_addons
      WHERE id = ANY(NEW.addon_ids);
    END IF;
    
    -- Get overtime amount (already calculated)
    v_overtime_amount := COALESCE(NEW.overtime_minutes, 0) * 10.0 / 30.0;
    
    -- Calculate totals
    v_total_earned := v_package_price + v_addon_total + v_overtime_amount;
    v_platform_fee := v_total_earned * 0.15; -- 15% platform fee
    v_payout_due := v_total_earned - v_platform_fee;
    
    -- Insert wallet entry
    INSERT INTO public.provider_wallet (
      provider_id,
      booking_id,
      base_amount,
      addon_amount,
      overtime_amount,
      total_earned,
      platform_fee,
      payout_due,
      status
    ) VALUES (
      v_provider_id,
      NEW.id,
      v_package_price,
      v_addon_total,
      v_overtime_amount,
      v_total_earned,
      v_platform_fee,
      v_payout_due,
      'pending'
    )
    ON CONFLICT (booking_id) DO NOTHING; -- Prevent duplicates
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on bookings table
DROP TRIGGER IF EXISTS trigger_create_wallet_entry ON public.bookings;
CREATE TRIGGER trigger_create_wallet_entry
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.create_provider_wallet_entry();

-- Add unique constraint on booking_id to prevent duplicate wallet entries
ALTER TABLE public.provider_wallet DROP CONSTRAINT IF EXISTS provider_wallet_booking_id_key;
ALTER TABLE public.provider_wallet ADD CONSTRAINT provider_wallet_booking_id_key UNIQUE (booking_id);