-- Fix security issues: Update function to set search_path properly
CREATE OR REPLACE FUNCTION public.notify_job_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'net'
AS $$
DECLARE
  v_function_url TEXT;
BEGIN
  -- Only trigger if job_status actually changed
  IF OLD.job_status IS DISTINCT FROM NEW.job_status THEN
    
    -- Build the function URL using environment settings
    v_function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-job-status-change';
    
    -- Call the edge function asynchronously
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