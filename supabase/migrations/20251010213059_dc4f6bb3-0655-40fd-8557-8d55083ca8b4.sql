-- Allow providers to view customer profiles for their assigned bookings
CREATE POLICY "Providers can view customer profiles for assigned jobs"
ON profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM bookings b
    JOIN provider_profiles pp ON b.provider_id = pp.id
    WHERE b.customer_id = profiles.id
    AND pp.user_id = auth.uid()
  )
);

-- Allow providers to view customer addresses for their assigned bookings
CREATE POLICY "Providers can view addresses for assigned jobs"
ON customer_addresses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM bookings b
    JOIN provider_profiles pp ON b.provider_id = pp.id
    WHERE b.address_id = customer_addresses.id
    AND pp.user_id = auth.uid()
  )
);