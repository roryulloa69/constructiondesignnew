-- Drop the overly permissive policies that allow any authenticated user to manage documents
-- These conflict with the admin-only policies and create a security bypass

DROP POLICY IF EXISTS "Authenticated users can insert documents" ON public.project_documents;
DROP POLICY IF EXISTS "Authenticated users can update documents" ON public.project_documents;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON public.project_documents;

-- The following admin-only policies remain in effect:
-- "Only admins can insert project documents"
-- "Only admins can update project documents"
-- "Only admins can delete project documents"
-- These use has_role(auth.uid(), 'admin') to properly restrict access