-- Create booking_requests table to handle specialist booking requests
CREATE TABLE public.booking_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  specialist_id UUID NOT NULL,
  service_type TEXT NOT NULL,
  preferred_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 60,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on booking_requests
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Clients can create booking requests and view their own
CREATE POLICY "Clients can create booking requests" 
  ON public.booking_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can view their own requests" 
  ON public.booking_requests 
  FOR SELECT 
  USING (auth.uid() = client_id);

-- Specialists can view and update requests directed to them
CREATE POLICY "Specialists can view their requests" 
  ON public.booking_requests 
  FOR SELECT 
  USING (auth.uid() = specialist_id);

CREATE POLICY "Specialists can update their requests" 
  ON public.booking_requests 
  FOR UPDATE 
  USING (auth.uid() = specialist_id);

-- Enable real-time for booking_requests
ALTER TABLE public.booking_requests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_requests;