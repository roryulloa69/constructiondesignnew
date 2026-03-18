-- Fix WARN level security issues

-- 1. Fix profiles table: Restrict profile viewing to own profile only
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles 
FOR SELECT TO authenticated 
USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles 
FOR SELECT TO authenticated 
USING (has_role(auth.uid(), 'admin'));

-- 2. Fix user_roles table: Remove duplicate overly permissive policy
DROP POLICY IF EXISTS "Users view roles" ON user_roles;

-- 3. Fix storage.objects for project-documents: Restrict to admins only
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON storage.objects;

CREATE POLICY "Admins can upload documents" ON storage.objects 
FOR INSERT TO public 
WITH CHECK ((bucket_id = 'project-documents') AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update documents" ON storage.objects 
FOR UPDATE TO public 
USING ((bucket_id = 'project-documents') AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete documents" ON storage.objects 
FOR DELETE TO public 
USING ((bucket_id = 'project-documents') AND has_role(auth.uid(), 'admin'));