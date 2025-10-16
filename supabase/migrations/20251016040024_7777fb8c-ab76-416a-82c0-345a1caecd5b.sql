-- Create trigger for job status change notifications
DROP TRIGGER IF EXISTS on_job_status_change ON public.bookings;

CREATE TRIGGER on_job_status_change
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_job_status_change();

-- Update the function to use environment variables directly
CREATE OR REPLACE FUNCTION public.notify_job_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_function_url TEXT;
  v_service_key TEXT;
  v_request_id BIGINT;
BEGIN
  -- Only trigger if job_status actually changed
  IF OLD.job_status IS DISTINCT FROM NEW.job_status THEN
    
    -- Get the Supabase URL and service key from the vault or use hardcoded values
    v_function_url := 'https://ctyulavksyguogudczpi.supabase.co/functions/v1/notify-job-status-change';
    
    -- Get service role key from environment (this will be set by Supabase)
    SELECT decrypted_secret INTO v_service_key 
    FROM vault.decrypted_secrets 
    WHERE name = 'service_role_key' 
    LIMIT 1;
    
    -- If not in vault, try to get from env
    IF v_service_key IS NULL THEN
      v_service_key := current_setting('app.settings.service_role_key', true);
    END IF;
    
    -- Call the edge function asynchronously using pg_net
    SELECT extensions.http_post(
      url := v_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || COALESCE(v_service_key, '')
      ),
      body := jsonb_build_object(
        'booking_id', NEW.id::text,
        'old_status', OLD.job_status,
        'new_status', NEW.job_status,
        'customer_id', NEW.customer_id::text,
        'provider_id', NEW.provider_id::text
      )
    ) INTO v_request_id;
    
    RAISE LOG 'Notification request sent with ID: %', v_request_id;
    
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block the update
    RAISE WARNING 'Failed to send notification: %', SQLERRM;
    RETURN NEW;
END;
$$;