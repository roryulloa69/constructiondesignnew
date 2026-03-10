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
import { Loader2, Upload, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { SortableImageCard } from "./SortableImageCard";

interface ProjectImage {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  rotation_angle: number;
  display_order: number;
}

interface UploadProgress {
  fileName: string;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface ImageManagerProps {
  projectId: string;
}

export const ImageManager = ({ projectId }: ImageManagerProps) => {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([]);
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

  const uploadSingleFile = async (file: File, displayOrder: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

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
          display_order: displayOrder,
        });

      if (dbError) throw dbError;

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Upload failed" 
      };
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setUploading(true);
    
    // Initialize upload queue
    setUploadQueue(fileArray.map(file => ({
      fileName: file.name,
      status: "pending" as const,
    })));

    let successCount = 0;
    let errorCount = 0;
    const currentImageCount = images.length;

    // Upload files sequentially to maintain order
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      // Update status to uploading
      setUploadQueue(prev => prev.map((item, idx) => 
        idx === i ? { ...item, status: "uploading" as const } : item
      ));

      const result = await uploadSingleFile(file, currentImageCount + i);

      // Update status based on result
      setUploadQueue(prev => prev.map((item, idx) => 
        idx === i ? { 
          ...item, 
          status: result.success ? "success" as const : "error" as const,
          error: result.error 
        } : item
      ));

      if (result.success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    // Clear upload queue after a delay
    setTimeout(() => {
      setUploadQueue([]);
    }, 3000);

    // Show summary toast
    if (errorCount === 0) {
      toast({
        title: "Success",
        description: `${successCount} image${successCount > 1 ? 's' : ''} uploaded successfully`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Upload completed with errors",
        description: `${successCount} succeeded, ${errorCount} failed`,
      });
    }

    fetchImages();
    setUploading(false);
    
    // Reset the input
    e.target.value = "";
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

  const isUploading = uploadQueue.length > 0;
  const uploadProgress = uploadQueue.length > 0 
    ? (uploadQueue.filter(u => u.status === "success" || u.status === "error").length / uploadQueue.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-4 items-center flex-wrap">
          <Label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              <Upload className="h-4 w-4" />
              Upload Images
            </div>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </Label>
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading {uploadQueue.filter(u => u.status === "success").length + 1} of {uploadQueue.length}...
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Select multiple images. Drag to reorder. First image is the cover.
          </p>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Uploading {uploadQueue.length} image{uploadQueue.length > 1 ? 's' : ''}...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {uploadQueue.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {item.status === "pending" && <div className="h-4 w-4 rounded-full bg-muted-foreground/30" />}
                  {item.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                  {item.status === "success" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  {item.status === "error" && <XCircle className="h-4 w-4 text-destructive" />}
                  <span className={item.status === "error" ? "text-destructive" : ""}>
                    {item.fileName}
                    {item.error && <span className="ml-2 text-xs">({item.error})</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
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

      {images.length === 0 && !isUploading && (
        <div className="text-center py-12 text-muted-foreground">
          No images uploaded yet. Upload your first image to get started.
        </div>
      )}
    </div>
  );
};
