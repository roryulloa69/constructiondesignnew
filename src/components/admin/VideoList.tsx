import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";

interface Video {
  id: string;
  video_url: string;
  title: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
}

interface VideoListProps {
  projectId: string;
  refreshTrigger: number;
}

export const VideoList = ({ projectId, refreshTrigger }: VideoListProps) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('project_videos')
        .select('*')
        .eq('project_id', projectId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch videos";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchVideos();
  }, [projectId, refreshTrigger, fetchVideos]);

  const handleDelete = async (video: Video) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const { error: dbError } = await supabase
        .from('project_videos')
        .delete()
        .eq('id', video.id);

      if (dbError) throw dbError;

      toast.success("Video deleted successfully");
      fetchVideos();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete video";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading videos...</div>;
  }

  if (videos.length === 0) {
    return <div className="text-muted-foreground">No videos uploaded yet.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Uploaded Videos</h3>
      <div className="grid gap-4">
        {videos.map((video) => (
          <div key={video.id} className="border border-border rounded-lg overflow-hidden bg-card">
            <VideoPlayer url={video.video_url} />
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-foreground">{video.title || "Untitled"}</h4>
                  {video.description && (
                    <p className="text-sm text-muted-foreground mt-1">{video.description}</p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(video)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
