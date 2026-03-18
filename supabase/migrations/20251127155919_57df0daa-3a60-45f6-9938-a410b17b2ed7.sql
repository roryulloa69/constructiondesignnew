-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create projects table
CREATE TABLE public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Interiors', 'Architecture', 'Development', 'Concepts', 'Pools', 'Custom Furniture')),
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Insert existing project_ids into projects table
INSERT INTO public.projects (id, title, category, display_order) VALUES
('bahamas-abaco-development', 'Bahamas Abaco Development', 'Development', 1),
('development', 'Development', 'Development', 2),
('hillside-cleanup', 'Hillside Cleanup', 'Development', 3),
('carmel-house-2', 'Carmel House 2', 'Architecture', 4),
('pacific-grove-design-build', 'Pacific Grove Design Build', 'Architecture', 5),
('miami-beach-condo', 'Miami Beach Condo', 'Interiors', 6),
('bigsur-mountain-remodel', 'Big Sur Mountain Remodel', 'Architecture', 7),
('carmel-valley-design-build', 'Carmel Valley Design Build', 'Architecture', 8),
('carmel-house-remdl-23', 'Carmel House Remodel 23', 'Architecture', 9),
('laguna-grande-design-build', 'Laguna Grande Design Build', 'Architecture', 10),
('coastal-hillside-restoration-2', 'Coastal Hillside Restoration', 'Development', 11),
('bahamas-beachfront-estate', 'Bahamas Beachfront Estate', 'Architecture', 12),
('montana-condo', 'Montana Condo', 'Interiors', 13),
('southcoast-remodel-design-build', 'South Coast Remodel Design Build', 'Architecture', 14),
('high-alpine-ranch', 'High Alpine Ranch', 'Architecture', 15),
('north-florida-renovation', 'North Florida Renovation', 'Interiors', 16),
('civil-engineering', 'Civil Engineering', 'Concepts', 17);

-- Add foreign key constraints
ALTER TABLE public.project_images
  ADD CONSTRAINT fk_project_images_project
  FOREIGN KEY (project_id) 
  REFERENCES public.projects(id) 
  ON DELETE CASCADE;

ALTER TABLE public.project_documents
  ADD CONSTRAINT fk_project_documents_project
  FOREIGN KEY (project_id)
  REFERENCES public.projects(id)
  ON DELETE CASCADE;

ALTER TABLE public.project_videos
  ADD CONSTRAINT fk_project_videos_project
  FOREIGN KEY (project_id)
  REFERENCES public.projects(id)
  ON DELETE CASCADE;

-- Trigger function for profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies
CREATE POLICY "Users can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users view roles" ON public.user_roles;
CREATE POLICY "Users view roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public view projects"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Admins insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public view images" ON public.project_images;
CREATE POLICY "Public view images"
  ON public.project_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage images" ON public.project_images;
CREATE POLICY "Admins manage images"
  ON public.project_images FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public view docs" ON public.project_documents;
CREATE POLICY "Public view docs"
  ON public.project_documents FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage docs" ON public.project_documents;
CREATE POLICY "Admins manage docs"
  ON public.project_documents FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public view videos" ON public.project_videos;
CREATE POLICY "Public view videos"
  ON public.project_videos FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage videos" ON public.project_videos;
CREATE POLICY "Admins manage videos"
  ON public.project_videos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));