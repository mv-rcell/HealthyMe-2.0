-- Add missing policies for tables that show INFO warnings

-- Add policies for User table
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own user data" 
ON public."User" 
FOR ALL 
USING (auth.uid()::text = id::text);

-- Add policies for WorkoutPlans table  
ALTER TABLE public."WorkoutPlans" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workout plans are publicly viewable" 
ON public."WorkoutPlans" 
FOR SELECT 
USING (true);

-- Add policies for appointments table (old table)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own appointments" 
ON public.appointments 
FOR ALL 
USING (auth.uid() = user_id);

-- Add policies for Profiles table (old table, different from profiles)
ALTER TABLE public."Profiles" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own profile data" 
ON public."Profiles" 
FOR ALL 
USING (auth.uid() = id);