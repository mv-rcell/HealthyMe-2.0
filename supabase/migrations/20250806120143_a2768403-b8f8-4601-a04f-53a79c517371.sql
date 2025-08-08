-- Create zoom_invitations table for managing Zoom meeting invitations
CREATE TABLE public.zoom_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  join_url TEXT NOT NULL,
  password TEXT,
  duration INTEGER NOT NULL DEFAULT 60,
  inviter_id UUID NOT NULL,
  invitee_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.zoom_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for zoom_invitations
CREATE POLICY "Users can view their own zoom invitations" 
ON public.zoom_invitations 
FOR SELECT 
USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

CREATE POLICY "Users can create zoom invitations" 
ON public.zoom_invitations 
FOR INSERT 
WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update their received invitations" 
ON public.zoom_invitations 
FOR UPDATE 
USING (auth.uid() = invitee_id);

-- Create index for better performance
CREATE INDEX idx_zoom_invitations_invitee_status ON public.zoom_invitations(invitee_id, status);
CREATE INDEX idx_zoom_invitations_inviter ON public.zoom_invitations(inviter_id);

-- Add trigger for updated_at
CREATE TRIGGER update_zoom_invitations_updated_at
BEFORE UPDATE ON public.zoom_invitations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for zoom_invitations
ALTER PUBLICATION supabase_realtime ADD TABLE public.zoom_invitations;