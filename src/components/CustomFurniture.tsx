import { useProjectsByCategory } from "@/hooks/useProjectsByCategory";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const CustomFurniture = () => {
  const { projects, loading } = useProjectsByCategory("Custom Furniture");

  return (
    <section id="custom-furniture" className="relative py-16 sm:py-20 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold mb-4 sm:mb-5 md:mb-6 text-foreground tracking-tight leading-tight">
              Custom Furniture & Millwork
            </h2>
            <p className="text-base sm:text-lg font-inter text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Beyond standard furnishings, we design and craft custom pieces that perfectly integrate with architectural spaces
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No custom furniture projects available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="group overflow-hidden bg-card border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {project.image_url && (
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ transform: `rotate(${project.rotation_angle || 0}deg)` }}
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="text-lg font-playfair font-semibold mb-2 text-foreground group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-sm font-inter font-light text-muted-foreground leading-relaxed line-clamp-2">
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
