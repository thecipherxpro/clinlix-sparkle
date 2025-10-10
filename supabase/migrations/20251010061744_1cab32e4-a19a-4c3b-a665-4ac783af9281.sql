-- Ensure provider_availability table has proper structure and constraints
ALTER TABLE provider_availability
DROP CONSTRAINT IF EXISTS unique_availability;

ALTER TABLE provider_availability
ADD CONSTRAINT unique_availability UNIQUE (provider_id, date, start_time, end_time);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_provider_availability_date 
ON provider_availability(provider_id, date);

-- Add check constraint for valid time range (7 AM to 7 PM)
ALTER TABLE provider_availability
DROP CONSTRAINT IF EXISTS check_time_range;

ALTER TABLE provider_availability
ADD CONSTRAINT check_time_range 
CHECK (
  start_time >= '07:00:00'::time 
  AND end_time <= '19:00:00'::time 
  AND start_time < end_time
);