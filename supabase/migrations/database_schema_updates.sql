-- Enhanced Specialist Onboarding Database Schema Updates

-- 1. Update profiles table to include verification status
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'pending_review', 'in_review', 'approved', 'rejected', 'suspended')),
ADD COLUMN IF NOT EXISTS license_number TEXT,
ADD COLUMN IF NOT EXISTS primary_certification TEXT,
ADD COLUMN IF NOT EXISTS certification_expiry DATE,
ADD COLUMN IF NOT EXISTS fitness_specialties TEXT[],
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS professional_references TEXT,
ADD COLUMN IF NOT EXISTS background_check_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS last_verification_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- 2. Create specialist_applications table for tracking applications
CREATE TABLE IF NOT EXISTS specialist_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  specialist_type TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  education TEXT NOT NULL,
  bio TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  license_number TEXT,
  primary_certification TEXT,
  certification_expiry DATE,
  fitness_specialties TEXT[],
  references TEXT NOT NULL,
  documents JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'pending_review', 'in_review', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  verification_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create specialist_documents table for document management
CREATE TABLE IF NOT EXISTS specialist_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES specialist_applications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL, -- 'cv', 'degree', 'id', 'fitness_cert', 'cpr_cert', etc.
  document_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  is_required BOOLEAN DEFAULT true,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  expiry_date DATE,
  verification_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create specialist_verifications table for tracking verification steps
CREATE TABLE IF NOT EXISTS specialist_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES specialist_applications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('document_check', 'education_verification', 'license_verification', 'reference_check', 'background_check', 'skills_assessment')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  result TEXT, -- 'passed', 'failed', 'needs_followup'
  details JSONB DEFAULT '{}'::jsonb,
  external_reference TEXT, -- Reference number from external verification service
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create specialist_references table for managing reference checks
CREATE TABLE IF NOT EXISTS specialist_references (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES specialist_applications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reference_name TEXT NOT NULL,
  reference_title TEXT,
  reference_organization TEXT,
  reference_email TEXT,
  reference_phone TEXT,
  relationship TEXT, -- 'supervisor', 'colleague', 'client', etc.
  years_known INTEGER,
  contact_status TEXT DEFAULT 'not_contacted' CHECK (contact_status IN ('not_contacted', 'contacted', 'responded', 'no_response')),
  response_rating INTEGER CHECK (response_rating >= 1 AND response_rating <= 5),
  response_comments TEXT,
  contacted_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  contacted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create admin_users table for verification staff
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'verifier', 'reviewer', 'support')),
  permissions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create verification_audit_log for tracking all verification activities
CREATE TABLE IF NOT EXISTS verification_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES specialist_applications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'created', 'submitted', 'reviewed', 'approved', 'rejected', 'document_uploaded', etc.
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_specialist_applications_user_id ON specialist_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_specialist_applications_status ON specialist_applications(status);
CREATE INDEX IF NOT EXISTS idx_specialist_applications_submitted_at ON specialist_applications(submitted_at);
CREATE INDEX IF NOT EXISTS idx_specialist_documents_application_id ON specialist_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_specialist_documents_verification_status ON specialist_documents(verification_status);
CREATE INDEX IF NOT EXISTS idx_specialist_verifications_application_id ON specialist_verifications(application_id);
CREATE INDEX IF NOT EXISTS idx_specialist_verifications_status ON specialist_verifications(status);
CREATE INDEX IF NOT EXISTS idx_specialist_references_application_id ON specialist_references(application_id);
CREATE INDEX IF NOT EXISTS idx_verification_audit_log_application_id ON verification_audit_log(application_id);

-- 9. Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_specialist_applications_updated_at 
  BEFORE UPDATE ON specialist_applications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specialist_documents_updated_at 
  BEFORE UPDATE ON specialist_documents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specialist_verifications_updated_at 
  BEFORE UPDATE ON specialist_verifications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specialist_references_updated_at 
  BEFORE UPDATE ON specialist_references 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Row Level Security (RLS) policies
ALTER TABLE specialist_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialist_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialist_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialist_references ENABLE ROW LEVEL SECURITY;

-- Users can only see their own applications
CREATE POLICY "Users can view own applications" ON specialist_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON specialist_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own draft applications" ON specialist_applications
  FOR UPDATE USING (auth.uid() = user_id AND status = 'draft');

-- Admin policies (assuming admin role is stored in profiles.role)
CREATE POLICY "Admins can view all applications" ON specialist_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'verifier', 'reviewer')
    )
  );

CREATE POLICY "Admins can update applications" ON specialist_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'verifier', 'reviewer')
    )
  );

-- Document policies
CREATE POLICY "Users can view own documents" ON specialist_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON specialist_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents" ON specialist_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'verifier', 'reviewer')
    )
  );

-- 11. Storage bucket policies for specialist documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('specialist-documents', 'specialist-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Policy for uploading documents
CREATE POLICY "Users can upload their own specialist documents" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'specialist-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for viewing documents
CREATE POLICY "Users can view their own specialist documents" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'specialist-documents' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'verifier', 'reviewer')
    )
  )
);

-- 12. Functions for application workflow

-- Function to submit application
CREATE OR REPLACE FUNCTION submit_specialist_application(application_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE specialist_applications 
  SET 
    status = 'submitted',
    submitted_at = NOW()
  WHERE id = application_id AND user_id = auth.uid() AND status = 'draft';
  
  -- Log the submission
  INSERT INTO verification_audit_log (application_id, user_id, action, details)
  VALUES (application_id, auth.uid(), 'submitted', '{"timestamp": "'||NOW()||'"}');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update verification status
CREATE OR REPLACE FUNCTION update_verification_status(
  application_id UUID,
  new_status TEXT,
  notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'verifier', 'reviewer')
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can update verification status';
  END IF;

  UPDATE specialist_applications 
  SET 
    status = new_status,
    reviewed_at = NOW(),
    reviewed_by = auth.uid(),
    verification_notes = COALESCE(notes, verification_notes)
  WHERE id = application_id;
  
  -- If approved, update the user's profile
  IF new_status = 'approved' THEN
    UPDATE profiles 
    SET 
      role = 'specialist',
      verification_status = 'approved',
      is_active = true,
      last_verification_date = NOW()
    WHERE id = (
      SELECT user_id FROM specialist_applications WHERE id = application_id
    );
  END IF;
  
  -- Log the action
  INSERT INTO verification_audit_log (application_id, admin_id, action, details)
  VALUES (application_id, auth.uid(), 'status_updated', 
    json_build_object('new_status', new_status, 'notes', notes)::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Views for easier querying

-- View for pending applications dashboard
CREATE OR REPLACE VIEW pending_applications_view AS
SELECT 
  sa.id,
  sa.user_id,
  p.full_name,
  p.email,
  sa.specialist_type,
  sa.experience_years,
  sa.submitted_at,
  sa.status,
  COUNT(sd.id) as total_documents,
  COUNT(CASE WHEN sd.verification_status = 'verified' THEN 1 END) as verified_documents,
  COUNT(CASE WHEN sd.is_required = true THEN 1 END) as required_documents
FROM specialist_applications sa
JOIN profiles p ON p.id = sa.user_id
LEFT JOIN specialist_documents sd ON sd.application_id = sa.id
WHERE sa.status IN ('submitted', 'pending_review', 'in_review')
GROUP BY sa.id, p.full_name, p.email, sa.specialist_type, sa.experience_years, sa.submitted_at, sa.status
ORDER BY sa.submitted_at ASC;

-- View for verification progress
CREATE OR REPLACE VIEW verification_progress_view AS
SELECT 
  sa.id as application_id,
  sa.user_id,
  p.full_name,
  sa.specialist_type,
  sa.status,
  COUNT(sv.id) as total_verifications,
  COUNT(CASE WHEN sv.status = 'completed' AND sv.result = 'passed' THEN 1 END) as passed_verifications,
  COUNT(CASE WHEN sv.status = 'completed' AND sv.result = 'failed' THEN 1 END) as failed_verifications,
  COUNT(CASE WHEN sv.status = 'pending' THEN 1 END) as pending_verifications
FROM specialist_applications sa
JOIN profiles p ON p.id = sa.user_id
LEFT JOIN specialist_verifications sv ON sv.application_id = sa.id
GROUP BY sa.id, sa.user_id, p.full_name, sa.specialist_type, sa.status;

COMMENT ON TABLE specialist_applications IS 'Stores specialist application data and tracks the approval workflow';
COMMENT ON TABLE specialist_documents IS 'Manages uploaded documents for specialist verification';
COMMENT ON TABLE specialist_verifications IS 'Tracks individual verification steps for each application';
COMMENT ON TABLE specialist_references IS 'Manages professional references and their verification status';
COMMENT ON TABLE verification_audit_log IS 'Audit trail for all verification activities';