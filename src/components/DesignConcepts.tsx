import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Card, CardContent } from "@/components/ui/card";

interface Concept {
  title: string;
  description: string;
}

const concepts: Concept[] = [
  {
    title: "Spatial Harmony",
    description: "Balance between open and enclosed spaces, creating environments that flow naturally",
  },
  {
    title: "Material Innovation",
    description: "Investigating the interplay of textures, finishes, and materials for visual depth",
  },
  {
    title: "Adaptive Design",
    description: "Developing flexible spaces that respond to client needs while maintaining aesthetic integrity",
  },
  {
    title: "Sustainable Integration",
    description: "Incorporating eco-friendly materials and systems without compromising design vision",
  },
];

export const DesignConcepts = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: headingRef, isVisible: headingVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section
      id="design-concepts"
      ref={elementRef as React.RefObject<HTMLElement>}
      className="relative py-16 sm:py-20 md:py-24 bg-muted/30"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div
            ref={headingRef as React.RefObject<HTMLDivElement>}
            className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 ${
              headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold mb-4 sm:mb-5 md:mb-6 text-foreground tracking-tight leading-tight">
              Design Concepts
            </h2>
            <p className="text-base sm:text-lg font-inter text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Every project begins with a concept—a vision that guides the entire creative process
            </p>
          </div>

          {/* Concepts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {concepts.map((concept, index) => (
              <Card
                key={concept.title}
                className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  animation: isVisible ? `fadeIn 0.6s ease-out ${index * 0.1}s forwards` : "none",
                  opacity: isVisible ? 1 : 0,
                }}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-2 h-2 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                    <h3 className="text-lg sm:text-xl font-playfair font-semibold text-foreground leading-tight">
                      {concept.title}
                    </h3>
                  </div>
                  <p className="text-foreground/70 font-inter text-sm sm:text-base leading-relaxed">
                    {concept.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
