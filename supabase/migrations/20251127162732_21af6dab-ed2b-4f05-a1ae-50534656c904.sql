-- Enable RLS on projects and project_images tables if not already enabled
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to projects
DROP POLICY IF EXISTS "Projects are publicly readable" ON public.projects;
CREATE POLICY "Projects are publicly readable" 
ON public.projects 
FOR SELECT 
USING (true);

-- Create policies for public read access to project_images
DROP POLICY IF EXISTS "Project images are publicly readable" ON public.project_images;
CREATE POLICY "Project images are publicly readable" 
ON public.project_images 
FOR SELECT 
USING (true);

-- Create storage bucket for project images if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('project_images', 'project_images')
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for public access to project images
DROP POLICY IF EXISTS "Project images are publicly accessible" ON storage.objects;
CREATE POLICY "Project images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project_images');