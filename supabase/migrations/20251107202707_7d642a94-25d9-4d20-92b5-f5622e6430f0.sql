-- Prevent users from changing their own role in profiles table
-- Drop existing update policy and recreate with role protection
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Recreate the update policy with role immutability check
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Add comment explaining the security measure
COMMENT ON POLICY "Users can update own profile" ON public.profiles IS 
'Allows users to update their own profile but prevents them from changing their role field. Role changes must be managed by administrators or database triggers only.';