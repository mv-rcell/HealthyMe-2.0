-- Create specialists_directory table
CREATE TABLE IF NOT EXISTS specialists_directory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  specialist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  location TEXT NOT NULL,
  availability TEXT NOT NULL,
  image_url TEXT DEFAULT '/placeholder.svg',
  experience TEXT NOT NULL,
  languages TEXT[] NOT NULL,
  consultation_fee DECIMAL(10,2) NOT NULL,
  subsequent_visits_fee DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  is_online BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(specialist_id)
);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_specialists_directory_specialty ON specialists_directory(specialty);
CREATE INDEX IF NOT EXISTS idx_specialists_directory_location ON specialists_directory(location);
CREATE INDEX IF NOT EXISTS idx_specialists_directory_active ON specialists_directory(is_active);
CREATE INDEX IF NOT EXISTS idx_specialists_directory_rating ON specialists_directory(rating DESC);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_specialists_directory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_specialists_directory_updated_at
  BEFORE UPDATE ON specialists_directory
  FOR EACH ROW
  EXECUTE FUNCTION update_specialists_directory_updated_at();

-- Add new columns to existing profiles table (if they don't exist)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'MH-DOC Clinic',
ADD COLUMN IF NOT EXISTS consultation_fee DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS subsequent_visits_fee DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS languages TEXT[],
ADD COLUMN IF NOT EXISTS availability TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create RLS policies for specialists_directory
ALTER TABLE specialists_directory ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all active specialists
CREATE POLICY "Anyone can view active specialists" ON specialists_directory
  FOR SELECT USING (is_active = true);

-- Policy: Only the specialist can update their own directory entry
CREATE POLICY "Specialists can update own directory entry" ON specialists_directory
  FOR UPDATE USING (specialist_id = auth.uid());

-- Policy: Only authenticated users can insert (handled by the application)
CREATE POLICY "Authenticated users can insert directory entries" ON specialists_directory
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only the specialist can delete their own entry
CREATE POLICY "Specialists can delete own directory entry" ON specialists_directory
  FOR DELETE USING (specialist_id = auth.uid());