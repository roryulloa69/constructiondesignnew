import { useProjectsByCategory } from "@/hooks/useProjectsByCategory";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const ArchitecturalRenderings = () => {
  const { projects, loading } = useProjectsByCategory("Architecture");

  return (
    <section id="renderings" className="relative py-16 sm:py-20 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-4 sm:mb-6 text-foreground tracking-tight">
              Architectural Renderings
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl font-inter font-light text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Precision-crafted architectural visualizations that bring design concepts to life
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No architectural projects available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="group overflow-hidden bg-card border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {project.image_url && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ transform: `rotate(${project.rotation_angle || 0}deg)` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-3 text-foreground group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-sm sm:text-base font-inter font-light text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
