import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ProjectGallery } from "./ProjectGallery";
import { useProjectsByCategory } from "@/hooks/useProjectsByCategory";

interface ProjectImage {
  id: string;
  image_url: string;
  rotation_angle: number;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url?: string;
  rotation_angle?: number;
  images?: ProjectImage[];
}

export const PoolsAndFurniture = () => {
  const { projects: poolProjects, loading: poolLoading } = useProjectsByCategory("Pools");
  const { projects: furnitureProjects, loading: furnitureLoading } = useProjectsByCategory("Custom Furniture");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const loading = poolLoading || furnitureLoading;

  const handleProjectClick = (project: Project) => {
    // Map the images to the expected format
    const galleryImages = project.images?.map(img => ({
      id: img.id,
      image_url: img.image_url,
      rotation_angle: img.rotation_angle || 0
    })) || [];

    setSelectedProject({
      ...project,
      images: galleryImages
    });
    setGalleryOpen(true);
  };

  return <>
      <section className="relative py-16 sm:py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto">
            {loading ? <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div> : <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Pools Section - Left (2 columns) */}
                <div className="lg:col-span-2">
                  <h2 className="text-3xl sm:text-4xl font-playfair font-semibold mb-6 text-foreground tracking-tight">
                    Pools
                  </h2>
                  {poolProjects.length === 0 ? <div className="text-center py-12 text-muted-foreground">
                      No pool projects available yet.
                    </div> : poolProjects.slice(0, 1).map(project => <Card key={project.id} onClick={() => handleProjectClick(project)} className="overflow-hidden bg-card border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group">
                      {project.image_url && <div className="relative aspect-[3/4] overflow-hidden">
                          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" style={{
                    transform: `rotate(${project.rotation_angle || 0}deg)`
                  }} />
                          <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                            <span className="text-cream text-lg font-inter">View Gallery</span>
                          </div>
                        </div>}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-playfair font-semibold mb-2 text-foreground">
                          {project.title}
                        </h3>
                        {project.description && <p className="text-sm font-inter font-light text-muted-foreground leading-relaxed line-clamp-2">
                            {project.description}
                          </p>}
                      </CardContent>
                    </Card>)}
                </div>

                {/* Custom Furniture Section - Right (3 columns) */}
                <div className="lg:col-span-3">
                  <h2 className="text-3xl sm:text-4xl font-playfair font-semibold mb-6 text-foreground tracking-tight">
                    Custom Furniture
                  </h2>
                  {furnitureProjects.length === 0 ? <div className="text-center py-12 text-muted-foreground">
                      No custom furniture projects available yet.
                    </div> : furnitureProjects.slice(0, 1).map(project => <Card key={project.id} onClick={() => handleProjectClick(project)} className="overflow-hidden bg-card border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group">
                      {project.image_url && <div className="relative aspect-[16/9] overflow-hidden">
                          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" style={{
                    transform: `rotate(${project.rotation_angle || 0}deg)`
                  }} />
                          <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                            <span className="text-cream text-lg font-inter">View Gallery</span>
                          </div>
                        </div>}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-playfair font-semibold mb-2 text-foreground">
                          {project.title}
                        </h3>
                        {project.description && <p className="text-sm font-inter font-light text-muted-foreground leading-relaxed line-clamp-2">
                            {project.description}
                          </p>}
                      </CardContent>
                    </Card>)}
                </div>
              </div>}
          </div>
        </div>
      </section>

      {selectedProject && <ProjectGallery open={galleryOpen} onOpenChange={setGalleryOpen} projectTitle={selectedProject.title} images={selectedProject.images || []} />}
    </>;
};
