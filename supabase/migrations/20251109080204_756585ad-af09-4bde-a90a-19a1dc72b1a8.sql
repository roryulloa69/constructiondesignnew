-- Create storage bucket for project videos
INSERT INTO storage.buckets (id, name)
VALUES ('project-videos', 'project-videos');

-- Create policies for video uploads
CREATE POLICY "Public can view project videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-videos');

CREATE POLICY "Authenticated users can upload project videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-videos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update their project videos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-videos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete project videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-videos' 
  AND auth.role() = 'authenticated'
);

-- Create table to track video metadata
CREATE TABLE IF NOT EXISTS public.project_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  video_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_videos ENABLE ROW LEVEL SECURITY;

-- RLS policies for project_videos
CREATE POLICY "Anyone can view project videos"
ON public.project_videos FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert project videos"
ON public.project_videos FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update project videos"
ON public.project_videos FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete project videos"
ON public.project_videos FOR DELETE
USING (auth.role() = 'authenticated');

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_project_videos_updated_at
  BEFORE UPDATE ON public.project_videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();