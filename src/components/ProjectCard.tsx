import React from "react";
import { Link } from "react-router-dom";
import { ImageWithWatermark } from "@/components/ImageWithWatermark";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    subtitle?: string;
    category: string;
    location?: string;
    images: string[];
  };
  categoryColor: string;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project, categoryColor, index }) => {
  const {
    elementRef,
    isVisible
  } = useScrollAnimation({
    threshold: 0.1
  });

  const coverImage = project.images[0];

  const formattedCategory = project.category
    .replace(" ", " • ")
    .replace("/", " • ");

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
    >
      <Link
        to={`/projects/${project.id}`}
        className="block"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden mb-5 bg-charcoal/5">
          <ImageWithWatermark>
            <ProgressiveImage
              src={coverImage}
              alt={project.title}
              objectFit="cover"
              className="relative z-10 w-full h-full group-hover:scale-105 transition-transform [transition-duration:800ms] ease-out"
            />
          </ImageWithWatermark>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-20 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3 z-30">
            <span className="bg-charcoal/80 text-white px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.15em] backdrop-blur-md">
              {formattedCategory}
            </span>
          </div>

          {/* Hover arrow */}
          <div className="absolute top-3 right-3 z-30 w-9 h-9 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-charcoal/30 backdrop-blur-sm">
            <ArrowRight className="h-3.5 w-3.5 text-white" />
          </div>
        </div>

        {/* Project Info */}
        <div className="space-y-1">
          <h3 className="font-playfair text-lg text-charcoal group-hover:text-gold transition-colors duration-500">
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="font-inter text-sm text-charcoal/60 font-light">
              {project.subtitle}
            </p>
          )}
          {project.location && (
            <p className="font-inter text-xs text-charcoal/40 mt-1.5 tracking-wide">
              {project.location}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';
