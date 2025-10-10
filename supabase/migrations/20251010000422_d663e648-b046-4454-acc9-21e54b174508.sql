-- Update the handle_new_user function to also create provider_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, role, first_name, last_name, email)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'role')::app_role,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email
  );
  
  -- If the user is a provider, create a provider_profile
  IF (NEW.raw_user_meta_data->>'role')::app_role = 'provider' THEN
    INSERT INTO public.provider_profiles (
      user_id,
      full_name,
      service_areas,
      languages,
      skills
    )
    VALUES (
      NEW.id,
      CONCAT(NEW.raw_user_meta_data->>'first_name', ' ', NEW.raw_user_meta_data->>'last_name'),
      ARRAY[]::text[],
      ARRAY['English']::text[],
      ARRAY[]::text[]
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Backfill existing provider users who don't have provider_profiles
INSERT INTO public.provider_profiles (user_id, full_name, service_areas, languages, skills)
SELECT 
  p.id,
  CONCAT(p.first_name, ' ', p.last_name),
  ARRAY[]::text[],
  ARRAY['English']::text[],
  ARRAY[]::text[]
FROM public.profiles p
LEFT JOIN public.provider_profiles pp ON p.id = pp.user_id
WHERE p.role = 'provider' AND pp.id IS NULL;