-- Add job_status column to track detailed workflow stages
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS job_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE;

-- Add check constraint for valid job statuses
ALTER TABLE public.bookings
ADD CONSTRAINT valid_job_status 
CHECK (job_status IN ('pending', 'confirmed', 'on_the_way', 'arrived', 'started', 'completed', 'declined'));

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_job_status ON public.bookings(job_status);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_status ON public.bookings(provider_id, job_status);