-- Create function to notify on job status change
CREATE OR REPLACE FUNCTION public.notify_job_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_function_url TEXT;
BEGIN
  -- Only trigger if job_status actually changed
  IF OLD.job_status IS DISTINCT FROM NEW.job_status THEN
    
    -- Get the Supabase function URL
    v_function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-job-status-change';
    
    -- Call the edge function asynchronously using pg_net if available
    -- For now, we'll use a simpler approach with Supabase's built-in capabilities
    
    PERFORM net.http_post(
      url := v_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'booking_id', NEW.id::text,
        'old_status', OLD.job_status,
        'new_status', NEW.job_status,
        'customer_id', NEW.customer_id::text,
        'provider_id', NEW.provider_id::text
      )
    );
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for job status changes
DROP TRIGGER IF EXISTS on_job_status_change ON public.bookings;

CREATE TRIGGER on_job_status_change
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_job_status_change();