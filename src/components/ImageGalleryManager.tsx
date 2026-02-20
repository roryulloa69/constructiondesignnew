import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, GripVertical } from "lucide-react";
import { projects } from "@/data/projects";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageEditor } from "@/components/ImageEditor";

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  display_order: number;
  is_before: boolean;
  is_after: boolean;
}

export const ImageGalleryManager = () => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [editingImage, setEditingImage] = useState<{ url: string; fileName: string } | null>(null);

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

  const [imageUrl, setImageUrl] = useState("");
  const [imageTitle, setImageTitle] = useState("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedProject) {
      toast.error("Please select a file and project");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setEditingImage({ url: imageUrl, fileName: file.name });
    if (event.target) event.target.value = '';
  };

  const handleSaveCroppedImage = async (croppedBlob: Blob, fileName: string) => {
    if (!selectedProject) return;

    setUploading(true);
    setEditingImage(null);

    try {
      const uploadFileName = `${selectedProject}/${Date.now()}-${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(uploadFileName, croppedBlob, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(uploadFileName);

      const { error: dbError } = await supabase
        .from('project_images')
        .insert({
          project_id: selectedProject,
          image_url: publicUrl,
          title: imageTitle.trim() || fileName,
          display_order: images.length,
          is_before: false,
          is_after: false,
        });

      if (dbError) throw dbError;

      toast.success("Image uploaded successfully");
      setImageTitle("");
      fetchImages();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(`Failed to upload: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddImage = async () => {
    if (!imageUrl.trim() || !selectedProject) {
      toast.error("Please enter an image URL and select a project");
      return;
    }

    setUploading(true);

    const { error } = await supabase
      .from('project_images')
      .insert({
        project_id: selectedProject,
        image_url: imageUrl.trim(),
        title: imageTitle.trim() || `Image ${images.length + 1}`,
        display_order: images.length,
        is_before: false,
        is_after: false,
      });

    setUploading(false);

    if (error) {
      toast.error(`Failed to add image: ${error.message}`);
    } else {
      toast.success("Image added successfully");
      setImageUrl("");
      setImageTitle("");
      fetchImages();
    }
  };

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

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    const updates = images.map((img, index) => ({
      id: img.id,
      display_order: index,
    }));

    for (const update of updates) {
      await supabase
        .from('project_images')
        .update({ display_order: update.display_order })
        .eq('id', update.id);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
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
      {editingImage && (
        <ImageEditor
          imageUrl={editingImage.url}
          fileName={editingImage.fileName}
          onSave={handleSaveCroppedImage}
          onCancel={() => setEditingImage(null)}
        />
      )}
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

        {selectedProject && (
          <>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="image-title">Image Title (optional)</Label>
                <Input
                  id="image-title"
                  type="text"
                  placeholder="e.g., Living Room View"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  disabled={uploading}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="file-upload">Upload from Device</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="mt-1"
                />
                <p className="text-xs text-charcoal/60 mt-1">
                  Upload photos directly from your phone or computer
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-charcoal/60">Or add by URL</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="image-url">Image URL or Path</Label>
                <Input
                  id="image-url"
                  type="text"
                  placeholder="/assets/project-name/image.jpg or https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={uploading}
                  className="mt-1"
                />
                <p className="text-xs text-charcoal/60 mt-1">
                  Enter a path to an image in your assets folder or an external URL
                </p>
              </div>

              <Button 
                onClick={handleAddImage}
                disabled={uploading || !imageUrl.trim()}
                className="w-full"
              >
                {uploading ? "Adding..." : "Add Image by URL"}
              </Button>
            </div>
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-charcoal/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-playfair font-semibold">
              Project Images ({images.length})
            </h2>
            <p className="text-sm text-charcoal/60 flex items-center gap-2">
              <GripVertical className="h-4 w-4" />
              Drag to reorder
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((image, index) => {
              const isDragging = draggedIndex === index;
              const isDropTarget = dragOverIndex === index && draggedIndex !== index;
              
              return (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragLeave={() => setDragOverIndex(null)}
                  className={`relative group rounded-lg transition-all duration-200 cursor-move overflow-hidden border-2 ${
                    isDragging 
                      ? 'opacity-40 scale-95 ring-2 ring-primary border-primary' 
                      : isDropTarget
                      ? 'ring-4 ring-accent scale-105 shadow-lg border-accent'
                      : 'bg-cream/20 hover:bg-cream/40 hover:shadow-md border-transparent hover:border-primary/30'
                  }`}
                >
                  <div className="absolute top-2 left-2 z-10 bg-primary/90 rounded-full p-1.5 shadow-md group-hover:bg-primary transition-colors">
                    <GripVertical className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
                <img
                  src={image.image_url}
                  alt={image.title || "Project image"}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Image {index + 1}</p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(image)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Checkbox
                        checked={image.is_before}
                        onCheckedChange={() => toggleBeforeAfter(image, 'is_before')}
                      />
                      <Label className="text-xs cursor-pointer">Before</Label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Checkbox
                        checked={image.is_after}
                        onCheckedChange={() => toggleBeforeAfter(image, 'is_after')}
                      />
                      <Label className="text-xs cursor-pointer">After</Label>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
