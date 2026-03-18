-- Fix project_images table policies
DROP POLICY IF EXISTS "Authenticated users can insert project images" ON public.project_images;
DROP POLICY IF EXISTS "Authenticated users can update project images" ON public.project_images;
DROP POLICY IF EXISTS "Authenticated users can delete project images" ON public.project_images;

CREATE POLICY "Admins can insert project images"
ON public.project_images FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update project images"
ON public.project_images FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project images"
ON public.project_images FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Fix project_videos table policies
DROP POLICY IF EXISTS "Authenticated users can insert project videos" ON public.project_videos;
DROP POLICY IF EXISTS "Authenticated users can update project videos" ON public.project_videos;
DROP POLICY IF EXISTS "Authenticated users can delete project videos" ON public.project_videos;

CREATE POLICY "Admins can insert project videos"
ON public.project_videos FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update project videos"
ON public.project_videos FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project videos"
ON public.project_videos FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Fix storage policies for project-images bucket
DROP POLICY IF EXISTS "Authenticated users can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete project images" ON storage.objects;

CREATE POLICY "Admins can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update project images in storage"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-images' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete project images from storage"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images' AND
  public.has_role(auth.uid(), 'admin')
);

-- Fix storage policies for project-videos bucket
DROP POLICY IF EXISTS "Authenticated users can upload project videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update project videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete project videos" ON storage.objects;

CREATE POLICY "Admins can upload project videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-videos' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update project videos in storage"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-videos' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete project videos from storage"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-videos' AND
  public.has_role(auth.uid(), 'admin')
);