import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SortableImageCard } from "./SortableImageCard";

interface ProjectImage {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  rotation_angle: number;
  display_order: number;
}

interface ImageManagerProps {
  projectId: string;
}

export const ImageManager = ({ projectId }: ImageManagerProps) => {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchImages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", projectId)
        .order("display_order");

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  }, [projectId, toast]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);

    const newImages = arrayMove(images, oldIndex, newIndex);
    
    // Optimistically update UI
    setImages(newImages);

    // Update display_order in database
    try {
      const updates = newImages.map((img, index) => ({
        id: img.id,
        display_order: index,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("project_images")
          .update({ display_order: update.display_order })
          .eq("id", update.id);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Image order updated",
      });
    } catch (error) {
      // Revert on error
      fetchImages();
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update order",
      });
    }
  };

  const handleRotate = async (imageId: string, currentRotation: number) => {
    const newRotation = (currentRotation + 90) % 360;

    try {
      const { error } = await supabase
        .from("project_images")
        .update({ rotation_angle: newRotation })
        .eq("id", imageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image rotated",
      });
      fetchImages();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${projectId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("project-images")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from("project_images")
        .insert({
          project_id: projectId,
          image_url: publicUrl,
          display_order: images.length,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Image uploaded",
      });
      fetchImages();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      const { error } = await supabase
        .from("project_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image deleted",
      });
      fetchImages();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Label htmlFor="image-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            <Upload className="h-4 w-4" />
            Upload Image
          </div>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </Label>
        {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
        <p className="text-sm text-muted-foreground">
          Drag images to reorder. First image is the cover.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <SortableImageCard
                key={image.id}
                image={image}
                onRotate={handleRotate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {images.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No images uploaded yet. Upload your first image to get started.
        </div>
      )}
    </div>
  );
};
