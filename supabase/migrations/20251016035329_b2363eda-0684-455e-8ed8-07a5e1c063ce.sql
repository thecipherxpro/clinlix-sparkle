-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage on the extensions schema to authenticated users
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;

-- Update the trigger function to use the correct schema path
CREATE OR REPLACE FUNCTION public.notify_job_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_function_url TEXT;
  v_request_id BIGINT;
BEGIN
  -- Only trigger if job_status actually changed
  IF OLD.job_status IS DISTINCT FROM NEW.job_status THEN
    
    -- Build the function URL
    v_function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-job-status-change';
    
    -- Call the edge function asynchronously using pg_net
    SELECT extensions.http_post(
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
    ) INTO v_request_id;
    
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block the update
    RAISE WARNING 'Failed to send notification: %', SQLERRM;
    RETURN NEW;
END;
$$;