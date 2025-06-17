-- Create messages table for specialist-client communication
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users NOT NULL,
  recipient_id UUID REFERENCES auth.users NOT NULL,
  appointment_id BIGINT REFERENCES appointments_new,
  message_text TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create specialist services table
CREATE TABLE public.specialist_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  specialist_id UUID REFERENCES auth.users NOT NULL,
  service_name TEXT NOT NULL,
  description TEXT,
  duration INTEGER DEFAULT 60, -- in minutes
  price NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client progress table
CREATE TABLE public.client_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES auth.users NOT NULL,
  specialist_id UUID REFERENCES auth.users NOT NULL,
  appointment_id BIGINT REFERENCES appointments_new,
  issue_description TEXT,
  recommendations TEXT,
  progress_notes TEXT,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" 
  ON public.messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Add RLS policies for specialist services
ALTER TABLE public.specialist_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Specialists can manage their services" 
  ON public.specialist_services 
  FOR ALL 
  USING (auth.uid() = specialist_id);

CREATE POLICY "Everyone can view active services" 
  ON public.specialist_services 
  FOR SELECT 
  USING (is_active = true);

-- Add RLS policies for client progress
ALTER TABLE public.client_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Specialists can manage client progress" 
  ON public.client_progress 
  FOR ALL 
  USING (auth.uid() = specialist_id);

CREATE POLICY "Clients can view their own progress" 
  ON public.client_progress 
  FOR SELECT 
  USING (auth.uid() = client_id);

-- Enable realtime for messages
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
