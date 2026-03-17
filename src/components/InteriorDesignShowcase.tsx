import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ProjectGallery } from "./ProjectGallery";
import { useProjectsByCategory } from "@/hooks/useProjectsByCategory";

interface ProjectImage {
  id: string;
  image_url: string;
  rotation_angle: number | null;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url?: string;
  rotation_angle?: number;
  images?: ProjectImage[];
}

export const InteriorDesignShowcase = () => {
  const { projects: architectureProjects, loading: archLoading } = useProjectsByCategory("Architecture");
  const { projects: interiorProjects, loading: intLoading } = useProjectsByCategory("Interiors");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const loading = archLoading || intLoading;

  const handleProjectClick = (project: Project) => {
    // Map the images to the expected format if needed, but the hook already provides images array
    // We just need to ensure the types match what ProjectGallery expects
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
    <section id="interior-design" className="relative py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {loading ? <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Architecture Section - Left */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-semibold mb-6 sm:mb-8 text-foreground tracking-tight">
                Architecture
              </h2>
              {architectureProjects.length === 0 ? <div className="text-center py-12 text-muted-foreground">
                No architecture projects available yet.
              </div> : architectureProjects.slice(0, 1).map(project => <Card key={project.id} onClick={() => handleProjectClick(project)} className="overflow-hidden bg-card border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group">
                {project.image_url && <div className="relative aspect-[16/9] overflow-hidden">
                  {/* Blurred background frame */}
                  <img
                    src={project.image_url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-110"
                    aria-hidden="true"
                  />
                  <img src={project.image_url} alt={project.title} className="relative z-10 w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" style={{
                    transform: `rotate(${project.rotation_angle || 0}deg)`
                  }} />
                  <div className="absolute inset-0 z-20 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="text-cream text-lg font-inter">View Gallery</span>
                  </div>
                </div>}
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-3 text-foreground">
                    {project.title}
                  </h3>
                  {project.description && <p className="text-sm sm:text-base font-inter font-light text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>}
                </CardContent>
              </Card>)}
            </div>

            {/* Interiors Section - Right */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-semibold mb-6 sm:mb-8 text-foreground tracking-tight">
                Interiors
              </h2>
              {interiorProjects.length === 0 ? <div className="text-center py-12 text-muted-foreground">
                No interior projects available yet.
              </div> : <div className="flex flex-col gap-6">
                {interiorProjects.slice(0, 3).map(project => <Card key={project.id} onClick={() => handleProjectClick(project)} className="overflow-hidden bg-card border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group">
                  {project.image_url && <div className="relative aspect-[3/4] overflow-hidden">
                    {/* Blurred background frame */}
                    <img
                      src={project.image_url}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-110"
                      aria-hidden="true"
                    />
                    <img src={project.image_url} alt={project.title} className="relative z-10 w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" style={{
                      transform: `rotate(${project.rotation_angle || 0}deg)`
                    }} />
                    <div className="absolute inset-0 z-20 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <span className="text-cream text-lg font-inter">View Gallery</span>
                    </div>
                  </div>}
                  <CardContent className="p-6">
                    <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-3 text-foreground">
                      {project.title}
                    </h3>
                    {project.description && <p className="text-sm sm:text-base font-inter font-light text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>}
                  </CardContent>
                </Card>)}
              </div>}
            </div>
          </div>}
        </div>
      </div>
    </section>

    {selectedProject && <ProjectGallery open={galleryOpen} onOpenChange={setGalleryOpen} projectTitle={selectedProject.title} images={selectedProject.images || []} />}
  </>;
};