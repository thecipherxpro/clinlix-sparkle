-- Fix password reset tokens exposure vulnerability
-- Change overly permissive RLS policy to restrict access to token owners only

DROP POLICY IF EXISTS "Users can read their own reset tokens" ON public.password_reset_tokens;

CREATE POLICY "Users can read their own reset tokens" 
ON public.password_reset_tokens 
FOR SELECT 
USING (auth.uid() = user_id);