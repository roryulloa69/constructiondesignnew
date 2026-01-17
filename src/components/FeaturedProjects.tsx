import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

// Import local images
import carmel1Cover from "@/assets/projects/carmel-1-cover.webp";
import carmelValleyNewCover from "@/assets/projects/carmel-valley-new-cover.webp";
import coastalRestorationCover from "@/assets/projects/coastal-restoration-cover.webp";
import civilCover from "@/assets/projects/civil-cover.webp";
import alpineRanchCover from "@/assets/projects/alpine-ranch-cover.webp";
import bigsurCover from "@/assets/projects/bigsur-cover.webp";

const featuredProjects = [
  {
    id: "carmel-house-remdl-23",
    title: "Carmel House Remodel",
    category: "Design/Build",
    location: "Carmel, CA",
    image: carmel1Cover,
    size: "large", // spans 2 columns
  },
  {
    id: "carmel-valley-design-build",
    title: "Carmel Valley Residence",
    category: "Design/Build",
    location: "Carmel Valley, CA",
    image: carmelValleyNewCover,
    size: "small",
  },
  {
    id: "coastal-restoration",
    title: "Coastal Restoration",
    category: "Residential",
    location: "Big Sur, CA",
    image: coastalRestorationCover,
    size: "small",
  },
  {
    id: "alpine-ranch",
    title: "Alpine Mountain Ranch",
    category: "Commercial",
    location: "Montana",
    image: alpineRanchCover,
    size: "small",
  },
  {
    id: "development",
    title: "Civil Development",
    category: "Civil",
    location: "California",
    image: civilCover,
    size: "small",
  },
  {
    id: "bigsur-remdl",
    title: "Big Sur Retreat",
    category: "Renovation",
    location: "Big Sur, CA",
    image: bigsurCover,
    size: "large",
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
      className="relative py-24 lg:py-32 bg-charcoal"
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <p className="font-inter text-xs tracking-[0.4em] text-gold uppercase mb-4">
              Featured Work
            </p>
            <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-white font-light leading-tight">
              Signature <span className="italic text-gold">Projects</span>
            </h2>
          </div>
          <button
            onClick={onViewAllClick}
            className="mt-8 md:mt-0 flex items-center gap-3 font-inter text-sm tracking-wider text-white/60 hover:text-gold transition-colors group border border-white/20 hover:border-gold/50 px-6 py-3"
          >
            View All Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project, index) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className={`group relative overflow-hidden bg-charcoal transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } ${project.size === "large" ? "md:col-span-2 aspect-[2/1]" : "aspect-square"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Default Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/50 transition-all duration-500" />

              {/* Content - Always visible at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="font-inter text-[10px] sm:text-xs tracking-[0.3em] text-gold uppercase mb-2">
                  {project.category}
                </p>
                <h3 className="font-playfair text-xl sm:text-2xl lg:text-3xl text-white mb-1 group-hover:text-gold transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="font-inter text-xs sm:text-sm text-white/50 group-hover:text-white/70 transition-colors">
                  {project.location}
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-6 right-6 w-12 h-12 border border-white/20 group-hover:border-gold group-hover:bg-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ArrowUpRight className="h-5 w-5 text-white group-hover:text-charcoal transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
