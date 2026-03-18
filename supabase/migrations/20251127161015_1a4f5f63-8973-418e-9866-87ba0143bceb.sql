-- Add rotation_angle column to project_images
ALTER TABLE public.project_images
  ADD COLUMN rotation_angle INTEGER DEFAULT 0 CHECK (rotation_angle IN (0, 90, 180, 270));