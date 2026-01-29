import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Import local images
import carmel1Cover from "@/assets/projects/carmel-1-cover.webp";
import carmelValleyNewCover from "@/assets/projects/carmel-valley-new-cover.webp";
import coastalRestorationCover from "@/assets/projects/coastal-restoration-cover.webp";
import civilCover from "@/assets/projects/civil-cover.webp";

const featuredProjects = [
  {
    id: "carmel-house-remdl-23",
    title: "Carmel House Remodel",
    category: "Design/Build",
    subtitle: "Complete Remodel",
    image: carmel1Cover,
  },
  {
    id: "carmel-valley-design-build",
    title: "Carmel Valley New",
    category: "Design/Build • Civil",
    subtitle: "Custom Residence",
    image: carmelValleyNewCover,
  },
  {
    id: "coastal-restoration",
    title: "Coastal Restoration",
    category: "Residential • Renovation",
    subtitle: "Historic Preservation",
    image: coastalRestorationCover,
  },
  {
    id: "development",
    title: "Civil Development",
    category: "Civil • Infrastructure",
    subtitle: "Site Development",
    image: civilCover,
  },
];

interface FeaturedProjectsProps {
  onViewAllClick: () => void;
}

export const FeaturedProjects = ({ onViewAllClick }: FeaturedProjectsProps) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="featured-projects"
      ref={elementRef as React.RefObject<HTMLElement>}
      className="relative py-24 lg:py-32 bg-[#0a0a0a]"
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <p className="font-inter text-xs tracking-[0.3em] text-gold uppercase mb-4">
              My Work
            </p>
            <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-white font-light">
              Featured Projects
            </h2>
          </div>
          <button
            onClick={onViewAllClick}
            className="mt-6 md:mt-0 flex items-center gap-2 font-inter text-sm tracking-wider text-white/60 hover:text-gold transition-colors group"
          >
            View All Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProjects.map((project, index) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className={`group relative aspect-[3/4] overflow-hidden bg-charcoal transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-inter text-[10px] tracking-[0.2em] text-gold/80 uppercase mb-2">
                  {project.category}
                </p>
                <h3 className="font-playfair text-xl text-white mb-1 group-hover:text-gold transition-colors">
                  {project.title}
                </h3>
                {project.subtitle && (
                  <p className="font-inter text-sm text-white/60">
                    {project.subtitle}
                  </p>
                )}
              </div>

              {/* Hover arrow */}
              <div className="absolute top-4 right-4 w-10 h-10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
