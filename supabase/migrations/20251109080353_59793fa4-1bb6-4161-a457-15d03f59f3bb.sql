-- Fix search_path security warning by recreating function with secure path
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers that were dropped
CREATE TRIGGER update_project_videos_updated_at
  BEFORE UPDATE ON public.project_videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();