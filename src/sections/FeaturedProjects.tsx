import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface FeaturedProjectsProps {
    onViewAllClick: () => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
    onViewAllClick,
}) => {
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

    // Get featured projects from the data
    const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);

    return (
        <section
            id="featured-projects"
            ref={elementRef as React.RefObject<HTMLElement>}
            className="py-32 lg:py-48 bg-cream relative overflow-hidden"
        >
            {/* Background watermark */}
            <div className="absolute top-16 right-0 pointer-events-none select-none overflow-hidden h-72 w-full">
                <span className="absolute right-0 top-0 font-playfair text-[18rem] text-charcoal/[0.02] leading-none whitespace-nowrap translate-x-1/4">
                    WORKS
                </span>
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 lg:mb-28 gap-12">
                    <div
                        className={`max-w-2xl transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                            }`}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-px bg-gold" />
                            <p className="font-inter text-[10px] tracking-[0.5em] text-gold uppercase">
                                Selected Works
                            </p>
                        </div>
                        <h2 className="font-playfair text-5xl lg:text-7xl text-charcoal font-extralight leading-[1.05]">
                            Crafting Legacy Through{" "}
                            <span className="italic text-charcoal/40 block sm:inline">Visionary Design</span>
                        </h2>
                    </div>

                    <div
                        className={`transition-all duration-1000 delay-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                            }`}
                    >
                        <Button
                            variant="outline"
                            onClick={onViewAllClick}
                            className="h-16 border-charcoal/10 text-charcoal hover:bg-charcoal hover:text-white group px-14 rounded-none uppercase text-[10px] tracking-[0.3em] font-inter transition-all duration-500"
                        >
                            View Full Portfolio
                            <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {featuredProjects.map((project, index) => (
                        <div
                            key={project.id}
                            className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                                }`}
                            style={{ transitionDelay: `${(index + 2) * 200}ms` }}
                        >
                            <ProjectCard
                                project={project}
                                categoryColor="gold"
                                index={index}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
