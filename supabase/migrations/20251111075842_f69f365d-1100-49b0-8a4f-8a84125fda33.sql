-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name)
VALUES ('project-images', 'project-images');

-- Create project_images table
CREATE TABLE public.project_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_before BOOLEAN DEFAULT false,
  is_after BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- Create policies for project_images
CREATE POLICY "Anyone can view project images"
ON public.project_images
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert project images"
ON public.project_images
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update project images"
ON public.project_images
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete project images"
ON public.project_images
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Storage policies for project-images bucket
CREATE POLICY "Anyone can view project images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'project-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update project images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'project-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete project images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'project-images' AND auth.uid() IS NOT NULL);

-- Create index for faster queries
CREATE INDEX idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX idx_project_images_display_order ON public.project_images(display_order);

-- Trigger for updated_at
CREATE TRIGGER update_project_images_updated_at
BEFORE UPDATE ON public.project_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();