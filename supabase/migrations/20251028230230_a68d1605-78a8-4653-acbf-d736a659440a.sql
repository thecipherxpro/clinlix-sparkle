-- Create user_roles table for better security
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role FROM public.profiles
ON CONFLICT (user_id, role) DO NOTHING;

-- Add review comment length constraint
ALTER TABLE public.provider_reviews
ADD CONSTRAINT comment_length_check CHECK (char_length(comment) <= 1000);

-- Add validation trigger for booking timestamps
CREATE OR REPLACE FUNCTION public.validate_booking_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate started_at comes after created_at
  IF NEW.started_at IS NOT NULL AND NEW.started_at < NEW.created_at THEN
    RAISE EXCEPTION 'Job cannot be started before booking creation';
  END IF;
  
  -- Validate completed_at comes after started_at
  IF NEW.completed_at IS NOT NULL AND NEW.started_at IS NOT NULL 
     AND NEW.completed_at < NEW.started_at THEN
    RAISE EXCEPTION 'Job cannot be completed before being started';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for booking timestamp validation
DROP TRIGGER IF EXISTS validate_booking_timestamps_trigger ON public.bookings;
CREATE TRIGGER validate_booking_timestamps_trigger
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_booking_timestamps();