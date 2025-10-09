-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('customer', 'provider');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text DEFAULT 'Portugal',
  currency text DEFAULT 'EUR',
  language text DEFAULT 'en',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create provider_profiles table
CREATE TABLE public.provider_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text NOT NULL,
  photo_url text,
  bio text,
  skills text[] DEFAULT ARRAY[]::text[],
  experience_years int DEFAULT 0,
  service_areas text[] DEFAULT ARRAY[]::text[],
  languages text[] DEFAULT ARRAY['English']::text[],
  verified boolean DEFAULT false,
  new_provider boolean DEFAULT true,
  rating_avg numeric DEFAULT 0,
  rating_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for provider_profiles (public can view, owner can edit)
CREATE POLICY "Anyone can view provider profiles"
  ON public.provider_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Providers can update own profile"
  ON public.provider_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can insert own profile"
  ON public.provider_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create cleaning_packages table
CREATE TABLE public.cleaning_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_code text NOT NULL UNIQUE,
  package_name text NOT NULL,
  bedroom_count int NOT NULL,
  one_time_price numeric NOT NULL,
  recurring_price numeric NOT NULL,
  time_included text NOT NULL,
  areas_included text[] DEFAULT ARRAY['bathroom', 'kitchen', 'livingroom', 'floors', 'dusting', 'surfaces']::text[]
);

-- Insert seed data for cleaning packages
INSERT INTO public.cleaning_packages (package_code, package_name, bedroom_count, one_time_price, recurring_price, time_included) VALUES
  ('C1', 'Studio', 0, 35, 32, '1h30'),
  ('C2', '1 Bedroom', 1, 45, 42, '2h00'),
  ('C3', '2 Bedrooms', 2, 55, 50, '2h30'),
  ('C4', '3 Bedrooms', 3, 65, 60, '3h00'),
  ('C5', '4 Bedrooms', 4, 75, 68, '3h30');

-- Public read access for packages
ALTER TABLE public.cleaning_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cleaning packages"
  ON public.cleaning_packages
  FOR SELECT
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, first_name, last_name, email)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'role')::app_role,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();