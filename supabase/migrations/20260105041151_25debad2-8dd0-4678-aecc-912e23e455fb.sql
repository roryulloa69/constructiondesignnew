-- Drop only the insecure policies (admin policies already exist)
DROP POLICY IF EXISTS "Authenticated upload for project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update for project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete for project images" ON storage.objects;