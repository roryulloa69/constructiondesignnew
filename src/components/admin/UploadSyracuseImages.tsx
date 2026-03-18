import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, AlertCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// Import all Syracuse images
import syracuseCover from "@/assets/projects/syracuse-cover.png";
import syracuse1 from "@/assets/projects/syracuse-1.png";
import syracuse2 from "@/assets/projects/syracuse-2.png";
import syracuse3 from "@/assets/projects/syracuse-3.png";
import syracuse4 from "@/assets/projects/syracuse-4.png";
import syracuse5 from "@/assets/projects/syracuse-5.png";
import syracuse6 from "@/assets/projects/syracuse-6.png";
import syracuse7 from "@/assets/projects/syracuse-7.png";
import syracuse8 from "@/assets/projects/syracuse-8.png";
import syracuse9 from "@/assets/projects/syracuse-9.png";
import syracuse10 from "@/assets/projects/syracuse-10.png";
import syracuse11 from "@/assets/projects/syracuse-11.png";
import syracuse12 from "@/assets/projects/syracuse-12.png";
import syracuse13 from "@/assets/projects/syracuse-13.png";
import syracuse14 from "@/assets/projects/syracuse-14.png";
import syracuse15 from "@/assets/projects/syracuse-15.png";
import syracuse16 from "@/assets/projects/syracuse-16.png";
import syracuse17 from "@/assets/projects/syracuse-17.png";
import syracuse18 from "@/assets/projects/syracuse-18.png";
import syracuse19 from "@/assets/projects/syracuse-19.png";
import syracuse20 from "@/assets/projects/syracuse-20.png";
import syracuse21 from "@/assets/projects/syracuse-21.png";
import syracuse22 from "@/assets/projects/syracuse-22.png";
import syracuse23 from "@/assets/projects/syracuse-23.png";
import syracuse24 from "@/assets/projects/syracuse-24.png";
import syracuse25 from "@/assets/projects/syracuse-25.png";
import syracuse26 from "@/assets/projects/syracuse-26.png";
import syracuse27 from "@/assets/projects/syracuse-27.webp";
import syracuse28 from "@/assets/projects/syracuse-28.webp";
import syracuse29 from "@/assets/projects/syracuse-29.webp";
import syracuse30 from "@/assets/projects/syracuse-30.webp";
import syracuse31 from "@/assets/projects/syracuse-31.webp";
import syracuse32 from "@/assets/projects/syracuse-32.webp";
import syracuse33 from "@/assets/projects/syracuse-33.webp";
import syracuse34 from "@/assets/projects/syracuse-34.webp";
import syracuse35 from "@/assets/projects/syracuse-35.webp";
import syracuse36 from "@/assets/projects/syracuse-36.webp";
import syracuse37 from "@/assets/projects/syracuse-37.webp";
import syracuse38 from "@/assets/projects/syracuse-38.webp";
import syracuse39 from "@/assets/projects/syracuse-39.webp";
import syracuse40 from "@/assets/projects/syracuse-40.webp";
import syracuse41 from "@/assets/projects/syracuse-41.webp";
import syracuse42 from "@/assets/projects/syracuse-42.webp";
import syracuse43 from "@/assets/projects/syracuse-43.webp";
import syracuse44 from "@/assets/projects/syracuse-44.webp";
import syracuse45 from "@/assets/projects/syracuse-45.webp";
import syracuse46 from "@/assets/projects/syracuse-46.webp";
import syracuse47 from "@/assets/projects/syracuse-47.webp";
import syracuse48 from "@/assets/projects/syracuse-48.webp";
import syracuse49 from "@/assets/projects/syracuse-49.webp";
import syracuse50 from "@/assets/projects/syracuse-50.webp";
import syracuse51 from "@/assets/projects/syracuse-51.webp";
import syracuse52 from "@/assets/projects/syracuse-52.webp";
import syracuse53 from "@/assets/projects/syracuse-53.webp";
import syracuse54 from "@/assets/projects/syracuse-54.webp";
import syracuse55 from "@/assets/projects/syracuse-55.webp";
import syracuse56 from "@/assets/projects/syracuse-56.webp";
import syracuse57 from "@/assets/projects/syracuse-57.webp";
import syracuse58 from "@/assets/projects/syracuse-58.webp";
import syracuse59 from "@/assets/projects/syracuse-59.webp";
import syracuse60 from "@/assets/projects/syracuse-60.webp";
import syracuse62 from "@/assets/projects/syracuse-62.webp";

const PROJECT_ID = "syracuse-house";

// Map of image imports with their filenames
const syracuseImages = [
  { image: syracuseCover, filename: "syracuse-cover.png" },
  { image: syracuse1, filename: "syracuse-1.png" },
  { image: syracuse2, filename: "syracuse-2.png" },
  { image: syracuse3, filename: "syracuse-3.png" },
  { image: syracuse4, filename: "syracuse-4.png" },
  { image: syracuse5, filename: "syracuse-5.png" },
  { image: syracuse6, filename: "syracuse-6.png" },
  { image: syracuse7, filename: "syracuse-7.png" },
  { image: syracuse8, filename: "syracuse-8.png" },
  { image: syracuse9, filename: "syracuse-9.png" },
  { image: syracuse10, filename: "syracuse-10.png" },
  { image: syracuse11, filename: "syracuse-11.png" },
  { image: syracuse12, filename: "syracuse-12.png" },
  { image: syracuse13, filename: "syracuse-13.png" },
  { image: syracuse14, filename: "syracuse-14.png" },
  { image: syracuse15, filename: "syracuse-15.png" },
  { image: syracuse16, filename: "syracuse-16.png" },
  { image: syracuse17, filename: "syracuse-17.png" },
  { image: syracuse18, filename: "syracuse-18.png" },
  { image: syracuse19, filename: "syracuse-19.png" },
  { image: syracuse20, filename: "syracuse-20.png" },
  { image: syracuse21, filename: "syracuse-21.png" },
  { image: syracuse22, filename: "syracuse-22.png" },
  { image: syracuse23, filename: "syracuse-23.png" },
  { image: syracuse24, filename: "syracuse-24.png" },
  { image: syracuse25, filename: "syracuse-25.png" },
  { image: syracuse26, filename: "syracuse-26.png" },
  { image: syracuse27, filename: "syracuse-27.webp" },
  { image: syracuse28, filename: "syracuse-28.webp" },
  { image: syracuse29, filename: "syracuse-29.webp" },
  { image: syracuse30, filename: "syracuse-30.webp" },
  { image: syracuse31, filename: "syracuse-31.webp" },
  { image: syracuse32, filename: "syracuse-32.webp" },
  { image: syracuse33, filename: "syracuse-33.webp" },
  { image: syracuse34, filename: "syracuse-34.webp" },
  { image: syracuse35, filename: "syracuse-35.webp" },
  { image: syracuse36, filename: "syracuse-36.webp" },
  { image: syracuse37, filename: "syracuse-37.webp" },
  { image: syracuse38, filename: "syracuse-38.webp" },
  { image: syracuse39, filename: "syracuse-39.webp" },
  { image: syracuse40, filename: "syracuse-40.webp" },
  { image: syracuse41, filename: "syracuse-41.webp" },
  { image: syracuse42, filename: "syracuse-42.webp" },
  { image: syracuse43, filename: "syracuse-43.webp" },
  { image: syracuse44, filename: "syracuse-44.webp" },
  { image: syracuse45, filename: "syracuse-45.webp" },
  { image: syracuse46, filename: "syracuse-46.webp" },
  { image: syracuse47, filename: "syracuse-47.webp" },
  { image: syracuse48, filename: "syracuse-48.webp" },
  { image: syracuse49, filename: "syracuse-49.webp" },
  { image: syracuse50, filename: "syracuse-50.webp" },
  { image: syracuse51, filename: "syracuse-51.webp" },
  { image: syracuse52, filename: "syracuse-52.webp" },
  { image: syracuse53, filename: "syracuse-53.webp" },
  { image: syracuse54, filename: "syracuse-54.webp" },
  { image: syracuse55, filename: "syracuse-55.webp" },
  { image: syracuse56, filename: "syracuse-56.webp" },
  { image: syracuse57, filename: "syracuse-57.webp" },
  { image: syracuse58, filename: "syracuse-58.webp" },
  { image: syracuse59, filename: "syracuse-59.webp" },
  { image: syracuse60, filename: "syracuse-60.webp" },
  { image: syracuse62, filename: "syracuse-62.webp" },
];

export const UploadSyracuseImages = () => {
  const [uploading, setUploading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");

  const convertImageToFile = async (imageUrl: string, filename: string): Promise<File | null> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      return null;
    }
  };

  const handleUpload = async () => {
    const confirm = window.confirm(
      `This will upload ${syracuseImages.length} Syracuse images to Supabase storage. This may take a few minutes. Continue?`
    );
    if (!confirm) return;

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    // Check existing images
    const { data: existing } = await supabase
      .from('project_images')
      .select('image_url')
      .eq('project_id', PROJECT_ID);

    const existingUrls = new Set(existing?.map(img => img.image_url) || []);

    for (let i = 0; i < syracuseImages.length; i++) {
      const { image, filename } = syracuseImages[i];
      setCurrentFile(filename);
      setProgress(((i + 1) / syracuseImages.length) * 100);

      try {
        // Convert image URL to File
        const file = await convertImageToFile(image, filename);
        if (!file) {
          failCount++;
          continue;
        }

        // Check if this image already exists
        const imageUrl = image as string;
        if (existingUrls.has(imageUrl)) {
          continue;
        }

        // Upload to Supabase storage
        const fileExt = filename.split('.').pop();
        const storageFileName = `${PROJECT_ID}/${Date.now()}-${i}-${filename}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('project-images')
          .upload(storageFileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          failCount++;
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(storageFileName);

        // Insert into database
        const { error: dbError } = await supabase
          .from('project_images')
          .insert({
            project_id: PROJECT_ID,
            image_url: publicUrl,
            title: `Syracuse ${i + 1}`,
            description: null,
            display_order: i,
            is_before: false,
            is_after: false,
          });

        if (dbError) {
          failCount++;
        } else {
          successCount++;
        }
      } catch (error) {
        failCount++;
      }
    }

    setUploading(false);
    setProgress(0);
    setCurrentFile("");

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} images!`);
      setTimeout(() => window.location.reload(), 1500);
    }
    if (failCount > 0) {
      toast.error(`Failed to upload ${failCount} images. Check console for details.`);
    }
  };

  const handleClearDatabaseImages = async () => {
    const confirm = window.confirm(
      "This will delete ALL Syracuse House images from the database and Supabase storage. This action cannot be undone. Continue?"
    );
    if (!confirm) return;

    setClearing(true);

    try {
      // Fetch all database images for Syracuse
      const { data: images, error: fetchError } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', PROJECT_ID);

      if (fetchError) {
        throw fetchError;
      }

      if (!images || images.length === 0) {
        toast.success("No database images found to clear.");
        setClearing(false);
        return;
      }

      // Delete from Supabase storage - improved path extraction
      const filesToDelete: string[] = [];
      
      for (const img of images) {
        const urlParts = img.image_url.split('/');
        const pathIndex = urlParts.findIndex(part => part === PROJECT_ID);
        
        if (pathIndex !== -1) {
          // Extract the full path from PROJECT_ID onwards
          const path = urlParts.slice(pathIndex).join('/');
          filesToDelete.push(path);
        } else {
          // Fallback: try to extract filename and construct path
          const fileName = urlParts[urlParts.length - 1];
          if (fileName) {
            filesToDelete.push(`${PROJECT_ID}/${fileName}`);
          }
        }
      }

      // Also try to list and delete all files in the syracuse-house folder
      const { data: listData } = await supabase.storage
        .from('project-images')
        .list(PROJECT_ID);

      if (listData) {
        const listedFiles = listData.map(file => `${PROJECT_ID}/${file.name}`);
        listedFiles.forEach(file => {
          if (!filesToDelete.includes(file)) {
            filesToDelete.push(file);
          }
        });
      }

      if (filesToDelete.length > 0) {
        // Delete in batches of 100
        const batchSize = 100;
        for (let i = 0; i < filesToDelete.length; i += batchSize) {
          const batch = filesToDelete.slice(i, i + batchSize);
          const { error: storageError } = await supabase.storage
            .from('project-images')
            .remove(batch);
        }
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('project_images')
        .delete()
        .eq('project_id', PROJECT_ID);

      if (deleteError) {
        throw deleteError;
      }

      toast.success(`Successfully cleared ${images.length} database images and ${filesToDelete.length} storage files!`);
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to clear images: ${errorMessage}`);
    } finally {
      setClearing(false);
    }
  };

  return (
    <Alert className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="font-medium mb-1">Upload Syracuse Images</p>
            <p className="text-sm text-muted-foreground mb-2">
              Upload all {syracuseImages.length} Syracuse House images to Supabase storage for better management.
            </p>
            {uploading && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploading: {currentFile}</p>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              onClick={handleClearDatabaseImages}
              disabled={uploading || clearing}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {clearing ? "Clearing..." : "Clear DB Images"}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || clearing}
              variant="default"
              size="sm"
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload All Images"}
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

