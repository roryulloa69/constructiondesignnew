import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ImageEditor } from "@/components/ImageEditor";

interface ImageUploaderProps {
  selectedProject: string;
  currentImageCount: number;
  onImageAdded: () => void;
}

export const ImageUploader = ({
  selectedProject,
  currentImageCount,
  onImageAdded,
}: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [editingImage, setEditingImage] = useState<{ url: string; fileName: string } | null>(null);

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
          display_order: currentImageCount,
          is_before: false,
          is_after: false,
        });

      if (dbError) throw dbError;

      toast.success("Image uploaded successfully");
      setImageTitle("");
      onImageAdded();
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
        title: imageTitle.trim() || `Image ${currentImageCount + 1}`,
        display_order: currentImageCount,
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
      onImageAdded();
    }
  };

  if (!selectedProject) return null;

  return (
    <>
      {editingImage && (
        <ImageEditor
          imageUrl={editingImage.url}
          fileName={editingImage.fileName}
          onSave={handleSaveCroppedImage}
          onCancel={() => setEditingImage(null)}
        />
      )}
      
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
  );
};
