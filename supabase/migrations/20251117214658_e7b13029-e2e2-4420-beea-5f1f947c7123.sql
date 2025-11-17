-- Fix infinite recursion in profiles UPDATE policy
-- The issue is that the WITH CHECK is querying the profiles table itself

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a security definer function to get user's role safely
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = _user_id 
  LIMIT 1
$$;

-- Recreate the policy using the security definer function
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND role = public.get_user_role(auth.uid())
);