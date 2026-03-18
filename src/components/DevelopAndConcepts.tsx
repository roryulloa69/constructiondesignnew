import { useProjectsByCategory } from "@/hooks/useProjectsByCategory";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const DevelopAndConcepts = () => {
  const { projects, loading } = useProjectsByCategory(["Development", "Concepts"]);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-semibold mb-8 sm:mb-12 text-foreground tracking-tight">
            Development & Concepts
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No development or concept projects available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden bg-card border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {project.image_url && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        style={{ transform: `rotate(${project.rotation_angle || 0}deg)` }}
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-3 text-foreground">
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
