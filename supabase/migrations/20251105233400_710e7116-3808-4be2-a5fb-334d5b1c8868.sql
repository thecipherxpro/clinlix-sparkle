-- Fix handle_new_user function to support Google OAuth signup
-- Default to 'customer' role when role is not provided in metadata

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_role app_role;
  v_first_name text;
  v_last_name text;
  v_full_name text;
BEGIN
  -- Determine role: use metadata role if exists, otherwise default to 'customer'
  v_role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'customer');
  
  -- Extract name fields from metadata or full_name
  v_first_name := NEW.raw_user_meta_data->>'first_name';
  v_last_name := NEW.raw_user_meta_data->>'last_name';
  v_full_name := NEW.raw_user_meta_data->>'full_name';
  
  -- If first_name is null but full_name exists (Google OAuth), try to split it
  IF v_first_name IS NULL AND v_full_name IS NOT NULL THEN
    v_first_name := split_part(v_full_name, ' ', 1);
    v_last_name := CASE 
      WHEN array_length(string_to_array(v_full_name, ' '), 1) > 1 
      THEN substring(v_full_name from length(v_first_name) + 2)
      ELSE NULL
    END;
  END IF;
  
  -- Insert into profiles
  INSERT INTO public.profiles (id, role, first_name, last_name, email)
  VALUES (
    NEW.id,
    v_role,
    v_first_name,
    v_last_name,
    NEW.email
  );
  
  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- If the user is a provider, create a provider_profile
  IF v_role = 'provider' THEN
    INSERT INTO public.provider_profiles (
      user_id,
      full_name,
      service_areas,
      languages,
      skills
    )
    VALUES (
      NEW.id,
      COALESCE(v_full_name, CONCAT(v_first_name, ' ', v_last_name)),
      ARRAY[]::text[],
      ARRAY['English']::text[],
      ARRAY[]::text[]
    );
  END IF;
  
  RETURN NEW;
END;
$$;