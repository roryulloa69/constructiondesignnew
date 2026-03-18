-- Drop existing overly permissive policies on project_documents
DROP POLICY IF EXISTS "Anyone can view project documents" ON public.project_documents;
DROP POLICY IF EXISTS "Authenticated users can insert project documents" ON public.project_documents;
DROP POLICY IF EXISTS "Authenticated users can update project documents" ON public.project_documents;
DROP POLICY IF EXISTS "Authenticated users can delete project documents" ON public.project_documents;

-- Create new admin-only policies matching project_images and project_videos security model

-- Allow anyone to view documents (for portfolio display)
CREATE POLICY "Anyone can view project documents"
ON public.project_documents
FOR SELECT
USING (true);

-- Only admins can insert documents
CREATE POLICY "Only admins can insert project documents"
ON public.project_documents
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update documents
CREATE POLICY "Only admins can update project documents"
ON public.project_documents
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete documents
CREATE POLICY "Only admins can delete project documents"
ON public.project_documents
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));