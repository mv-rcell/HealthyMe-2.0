-- Update the RLS policy to allow viewing specialists even with null is_active
DROP POLICY IF EXISTS "Anyone can read active specialists" ON public.profiles;

CREATE POLICY "Anyone can read specialists" 
ON public.profiles 
FOR SELECT 
USING (role = 'specialist');

-- Also set default value for is_active to true and update existing null values
ALTER TABLE public.profiles ALTER COLUMN is_active SET DEFAULT true;

-- Update existing specialist profiles to set is_active = true where it's null
UPDATE public.profiles 
SET is_active = true 
WHERE role = 'specialist' AND is_active IS NULL;