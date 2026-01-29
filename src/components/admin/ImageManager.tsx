import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RotateCw, Trash2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

      const { error: uploadError, data } = await supabase.storage
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
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-4">
              <div 
                className="relative aspect-square mb-3 overflow-hidden rounded-md bg-muted"
                style={{
                  transform: `rotate(${image.rotation_angle}deg)`,
                }}
              >
                <img
                  src={image.image_url}
                  alt={image.title || "Project image"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRotate(image.id, image.rotation_angle)}
                  className="flex-1"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No images uploaded yet. Upload your first image to get started.
        </div>
      )}
    </div>
  );
};
