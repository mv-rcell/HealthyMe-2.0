-- Enable RLS on video_sessions table
ALTER TABLE public.video_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for video sessions
CREATE POLICY "Users can view their own video sessions" 
ON public.video_sessions 
FOR SELECT 
USING (auth.uid() = client_id OR auth.uid() = specialist_id);

CREATE POLICY "Users can create video sessions" 
ON public.video_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = client_id OR auth.uid() = specialist_id);

CREATE POLICY "Users can update their own video sessions" 
ON public.video_sessions 
FOR UPDATE 
USING (auth.uid() = client_id OR auth.uid() = specialist_id);

-- Enable realtime for video_sessions
ALTER TABLE public.video_sessions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.video_sessions;