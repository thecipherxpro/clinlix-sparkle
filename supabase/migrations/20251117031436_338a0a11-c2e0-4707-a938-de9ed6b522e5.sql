-- Create trigger function to notify on new messages
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_function_url TEXT;
  v_service_key TEXT;
  v_request_id BIGINT;
BEGIN
  -- Get the Supabase URL and service key
  v_function_url := 'https://ctyulavksyguogudczpi.supabase.co/functions/v1/notify-new-message';
  
  -- Get service role key from vault
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
      'message_id', NEW.id::text,
      'booking_id', NEW.booking_id::text,
      'sender_id', NEW.sender_id::text,
      'content', NEW.content
    )
  ) INTO v_request_id;
  
  RAISE LOG 'Message notification request sent with ID: %', v_request_id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block the message insert
    RAISE WARNING 'Failed to send message notification: %', SQLERRM;
    RETURN NEW;
END;
$function$;

-- Create trigger on messages table
DROP TRIGGER IF EXISTS on_new_message ON public.messages;
CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_message();