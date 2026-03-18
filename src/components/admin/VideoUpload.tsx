import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

interface VideoUploadProps {
  projectId: string;
  onUploadComplete: () => void;
}

export const VideoUpload = ({ projectId, onUploadComplete }: VideoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      // Whitelist safe protocols only
      const allowedProtocols = ['http:', 'https:'];
      if (!allowedProtocols.includes(parsed.protocol)) {
        return false;
      }
      // Add length limit (URLs over 2048 chars may cause issues)
      if (url.length > 2048) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Video file must be less than 100MB");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated. Please log in again.');
      }

      // Check admin role
      const { data: roleCheck, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin');

      if (roleError || !roleCheck || roleCheck.length === 0) {
        throw new Error('Admin privileges required to upload videos');
      }

      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}/${Date.now()}-${file.name}`;

      const { error: uploadError, data } = await supabase.storage
        .from('project-videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-videos')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('project_videos')
        .insert({
          project_id: projectId,
          video_url: publicUrl,
          title: title.trim() || file.name,
          description: description.trim() || null,
        });

      if (dbError) throw dbError;

      toast.success("Video uploaded successfully!");
      setTitle("");
      setDescription("");
      onUploadComplete();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to upload video";
      toast.error(`Failed to upload: ${message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (event.target) event.target.value = '';
    }
  };

  const handleUrlSubmit = async () => {
    if (!videoUrl.trim()) {
      toast.error("Please enter a video URL");
      return;
    }

    if (!validateUrl(videoUrl)) {
      toast.error("Please enter a valid URL");
      return;
    }

    setUploading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated. Please log in again.');
      }

      // Check admin role
      const { data: roleCheck, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin');

      if (roleError) {
        throw new Error(`Role check failed: ${roleError.message}`);
      }

      if (!roleCheck || roleCheck.length === 0) {
        throw new Error('Admin privileges required to add videos');
      }

      // Save to database
      const { data: dbData, error: dbError } = await supabase
        .from('project_videos')
        .insert({
          project_id: projectId,
          video_url: videoUrl.trim(),
          title: title.trim() || null,
          description: description.trim() || null,
        })
        .select();

      if (dbError) {
        throw new Error(`Database insert failed: ${dbError.message}`);
      }

      toast.success("Video added successfully!");
      setVideoUrl("");
      setTitle("");
      setDescription("");
      onUploadComplete();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add video";
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
      <h3 className="text-lg font-semibold text-foreground">Add Video</h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="video-title">Title (optional)</Label>
          <Input
            id="video-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Video title"
            className="mt-1"
            disabled={uploading}
          />
        </div>

        <div>
          <Label htmlFor="video-description">Description (optional)</Label>
          <Textarea
            id="video-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Video description"
            className="mt-1"
            rows={3}
            disabled={uploading}
          />
        </div>

        <div>
          <Label htmlFor="video-file">Upload from Device</Label>
          <Input
            id="video-file"
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Upload video files (MP4, MOV, etc.) - Max 100MB
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or add by URL</span>
          </div>
        </div>

        <div>
          <Label htmlFor="video-url">Video URL</Label>
          <Input
            id="video-url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or direct video URL"
            className="mt-1"
            disabled={uploading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Supports YouTube, Vimeo, or direct video links (MP4, WebM)
          </p>
        </div>

        <Button
          onClick={handleUrlSubmit}
          disabled={uploading || !videoUrl.trim()}
          className="w-full"
        >
          <Link className="mr-2 h-4 w-4" />
          {uploading ? "Adding..." : "Add Video by URL"}
        </Button>
      </div>
    </div>
  );
};
