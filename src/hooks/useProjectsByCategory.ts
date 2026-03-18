import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectImage {
  id: string;
  image_url: string;
  rotation_angle: number;
  display_order: number;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string;
  display_order: number;
  image_url?: string;
  rotation_angle?: number;
  images?: ProjectImage[];
}

export const useProjectsByCategory = (category: string | string[]) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from("projects")
          .select(`
            *,
            project_images!fk_project_images_project(
              id,
              image_url,
              rotation_angle,
              display_order
            )
          `);

        if (Array.isArray(category)) {
          query = query.in("category", category).order("category", { ascending: true });
        } else {
          query = query.eq("category", category);
        }

        // Always order by display_order
        query = query.order("display_order", { ascending: true });

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;

        // Transform data
        const projectsWithImages = (data || []).map((project) => {
          // Sort images by display_order locally as we can't easily order nested relation in Supabase JS client v2 in all cases, 
          // though we could try. But local sort is safe.
          const sortedImages = (project.project_images || []).sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));

          return {
            ...project,
            image_url: sortedImages[0]?.image_url,
            rotation_angle: sortedImages[0]?.rotation_angle || 0,
            images: sortedImages,
          };
        });

        setProjects(projectsWithImages);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        if (import.meta.env.DEV) {
          console.error("Error fetching projects:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProjects();
    }
  }, [JSON.stringify(category)]);

  return { projects, loading, error };
};
