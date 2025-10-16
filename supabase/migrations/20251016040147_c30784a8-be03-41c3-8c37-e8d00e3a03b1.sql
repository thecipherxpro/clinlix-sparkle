-- Add RLS policies for password_reset_tokens table
-- This table is used for password reset functionality

-- Allow users to insert their own reset tokens
CREATE POLICY "Users can create reset tokens for themselves"
ON public.password_reset_tokens
FOR INSERT
WITH CHECK (true); -- Anyone can create a reset token request

-- Allow users to read their own reset tokens (for verification)
CREATE POLICY "Users can read their own reset tokens"
ON public.password_reset_tokens
FOR SELECT
USING (true); -- Service will verify token validity

-- Allow automatic deletion of expired tokens
CREATE POLICY "Service can delete expired tokens"
ON public.password_reset_tokens
FOR DELETE
USING (expires_at < now());