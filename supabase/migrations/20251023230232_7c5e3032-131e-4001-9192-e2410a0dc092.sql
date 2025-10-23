-- Drop the old policy
DROP POLICY IF EXISTS "Customers can create reviews for own bookings" ON provider_reviews;

-- Create updated policy that checks job_status instead of status
CREATE POLICY "Customers can create reviews for own bookings" 
ON provider_reviews 
FOR INSERT 
WITH CHECK (
  (auth.uid() = customer_id) 
  AND (EXISTS (
    SELECT 1
    FROM bookings
    WHERE bookings.id = provider_reviews.booking_id 
    AND bookings.customer_id = auth.uid() 
    AND bookings.job_status = 'completed'
  ))
);