-- Add settings fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS available_status BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS accept_recurring BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT true;

-- Update language column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'language'
  ) THEN
    ALTER TABLE profiles ADD COLUMN language TEXT DEFAULT 'en';
  END IF;
END $$;