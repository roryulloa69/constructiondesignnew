import React from "react";
import { Link } from "react-router-dom";
import { ImageWithWatermark } from "@/components/ImageWithWatermark";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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

  // Format category with bullet separator
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
        className="block hover-scale"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-black">
          <ImageWithWatermark>
            <ProgressiveImage
              src={coverImage}
              alt={project.title}
              className="w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
              objectFit="contain"
            />
          </ImageWithWatermark>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Category Badge - Bottom Left */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="bg-charcoal/80 text-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm rounded-sm">
              {formattedCategory}
            </span>
          </div>
        </div>

        {/* Project Info - Title, Subtitle, Location */}
        <div className="space-y-0.5">
          <h3 className="font-inter text-base text-charcoal group-hover:text-gold transition-colors duration-300">
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="font-inter text-base text-charcoal">
              {project.subtitle}
            </p>
          )}
          {project.location && (
            <p className="font-inter text-sm text-charcoal/50 mt-1">
              {project.location}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';
