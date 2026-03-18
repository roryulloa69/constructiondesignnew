import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { Project } from "@/data/projects";
import { ImageWithWatermark } from "./ImageWithWatermark";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectCardCarouselProps {
  project: Project;
  categoryColor: string;
  index: number;
}

export const ProjectCardCarousel: React.FC<ProjectCardCarouselProps> = React.memo(({
  project,
  categoryColor,
  index,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(project.images.length);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Memoize image load handler
  const handleImageLoad = useCallback((imgIndex: number) => {
    setImagesLoaded(prev => new Set(prev).add(imgIndex));
  }, []);

  // Memoize navigation handlers
  const handlePrevClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    api?.scrollPrev();
  }, [api]);

  const handleNextClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    api?.scrollNext();
  }, [api]);

  return (
    <Link
      to={`/project/${project.id}`}
      className="group cursor-pointer opacity-0 animate-fade-in-up block"
      style={{ animationDelay: `${index * 100 + 400}ms` }}
    >
      <div
        ref={elementRef as React.RefObject<HTMLDivElement>}
        className="relative aspect-[4/5] overflow-hidden rounded-lg mb-5 bg-charcoal shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-1.5"
      >
        <Carousel 
          setApi={setApi} 
          className="w-full h-full"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="h-full -ml-0">
            {project.images.map((image, imgIndex) => (
              <CarouselItem key={imgIndex} className="h-full pl-0">
                <ImageWithWatermark>
                  <div className="h-full relative">
                    {!imagesLoaded.has(imgIndex) && (
                      <Skeleton className="absolute inset-0 w-full h-full" />
                    )}
                    {isVisible && (
                      <img
                        src={image}
                        alt={`${project.title} - Image ${imgIndex + 1}`}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                          imagesLoaded.has(imgIndex) ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={imgIndex === 0 && project.coverRotation ? { transform: `rotate(${project.coverRotation}deg)` } : undefined}
                        loading="lazy"
                        onLoad={() => handleImageLoad(imgIndex)}
                        decoding="async"
                      />
                    )}
                  </div>
                </ImageWithWatermark>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Arrows - Only show if more than 1 image */}
          {project.images.length > 1 && (
            <>
              <button
                onClick={handlePrevClick}
                className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 h-9 w-9 md:h-10 md:w-10 rounded-full bg-white/90 hover:bg-white hover:scale-110 text-charcoal flex items-center justify-center z-10 shadow-md backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <button
                onClick={handleNextClick}
                className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 h-9 w-9 md:h-10 md:w-10 rounded-full bg-white/90 hover:bg-white hover:scale-110 text-charcoal flex items-center justify-center z-10 shadow-md backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </>
          )}
        </Carousel>

        {/* Image Counter Badge */}
        {project.images.length > 1 && (
          <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-charcoal/85 backdrop-blur-sm text-cream px-3 md:px-3.5 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold tracking-wider z-10 shadow-md border border-white/10">
            {current} / {count}
          </div>
        )}

        {/* Enhanced Gradient Overlay - Darker at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/35 to-transparent pointer-events-none" />

        {/* Overlay Content */}
        <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end transition-all duration-400 pointer-events-none">
          <span
            className={`inline-block w-fit px-3.5 py-1.5 rounded-full text-[10px] md:text-xs uppercase tracking-widest font-bold mb-3 transition-all duration-300 shadow-md ${categoryColor}`}
          >
            {project.category}
          </span>
          <h3 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1.5 transition-all duration-300 leading-tight">
            {project.title}
          </h3>
          <p className="font-inter text-xs md:text-sm text-white/85 font-light tracking-wide">
            Residential • {project.category.includes('Construction') ? 'Construction' : project.category.includes('Design') ? 'Design' : 'Development'}
          </p>
        </div>
      </div>
    </Link>
  );
});

ProjectCardCarousel.displayName = 'ProjectCardCarousel';
