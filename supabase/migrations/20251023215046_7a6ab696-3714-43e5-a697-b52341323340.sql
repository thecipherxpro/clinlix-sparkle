-- Add has_review column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS has_review boolean DEFAULT false;

-- Create function to update provider rating average
CREATE OR REPLACE FUNCTION public.update_provider_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update provider's average rating and count
  UPDATE provider_profiles
  SET 
    rating_avg = (
      SELECT COALESCE(AVG(rating)::numeric(10,2), 0)
      FROM provider_reviews
      WHERE provider_id = NEW.provider_id
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM provider_reviews
      WHERE provider_id = NEW.provider_id
    )
  WHERE id = NEW.provider_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to recalculate rating after insert or update
DROP TRIGGER IF EXISTS recalc_rating ON public.provider_reviews;
CREATE TRIGGER recalc_rating
AFTER INSERT OR UPDATE ON public.provider_reviews
FOR EACH ROW EXECUTE FUNCTION public.update_provider_rating();