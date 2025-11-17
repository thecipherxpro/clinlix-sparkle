-- Add gender enum type
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- Add new fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN gender public.gender_type,
ADD COLUMN date_of_birth date,
ADD COLUMN residential_street text,
ADD COLUMN residential_apt_unit text,
ADD COLUMN residential_city text,
ADD COLUMN residential_province text,
ADD COLUMN residential_postal_code text,
ADD COLUMN residential_country text DEFAULT 'Portugal';

-- Add helpful comment
COMMENT ON COLUMN public.profiles.date_of_birth IS 'User date of birth for age verification and demographics';
COMMENT ON COLUMN public.profiles.residential_street IS 'Residential address - separate from service addresses for security';
COMMENT ON COLUMN public.profiles.residential_country IS 'Residential country - required for both customers and providers';