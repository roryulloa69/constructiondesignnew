import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { projects } from "@/data/projects";
import { ImageGrid } from "./gallery/ImageGrid";
import { ImageUploader } from "./gallery/ImageUploader";
import { ProjectImage } from "./gallery/types";

export const ImageGalleryManager = () => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [images, setImages] = useState<ProjectImage[]>([]);

  const fetchImages = useCallback(async () => {
    const { data, error } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', selectedProject)
      .order('display_order', { ascending: true });

    if (error) {
      toast.error("Failed to fetch images");
    } else {
      setImages(data || []);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      fetchImages();
    }
  }, [selectedProject, fetchImages]);

  const handleDelete = async (image: ProjectImage) => {
    const fileName = image.image_url.split('/').pop();
    if (!fileName) return;

    await supabase.storage
      .from('project-images')
      .remove([`${selectedProject}/${fileName}`]);

    const { error } = await supabase
      .from('project_images')
      .delete()
      .eq('id', image.id);

    if (error) {
      toast.error("Failed to delete image");
    } else {
      toast.success("Image deleted");
      fetchImages();
    }
  };

  const handleReorderSave = async (updatedImages: ProjectImage[]) => {
    const updates = updatedImages.map((img, index) => ({
      id: img.id,
      display_order: index,
    }));

    for (const update of updates) {
      await supabase
        .from('project_images')
        .update({ display_order: update.display_order })
        .eq('id', update.id);
    }
    toast.success("Order updated");
  };

  const toggleBeforeAfter = async (image: ProjectImage, field: 'is_before' | 'is_after') => {
    const { error } = await supabase
      .from('project_images')
      .update({ [field]: !image[field] })
      .eq('id', image.id);

    if (error) {
      toast.error("Failed to update image");
    } else {
      fetchImages();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-charcoal/10">
        <Label htmlFor="project">Select Project</Label>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Choose a project" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ImageUploader 
          selectedProject={selectedProject}
          currentImageCount={images.length}
          onImageAdded={fetchImages}
        />
      </div>

      <ImageGrid 
        images={images}
        setImages={setImages}
        onDelete={handleDelete}
        onToggle={toggleBeforeAfter}
        onReorderSave={handleReorderSave}
      />
    </div>
  );
};
