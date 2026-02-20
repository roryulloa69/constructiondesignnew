import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { projects, getProjectsByCategory, type ProjectCategory } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";

type Category = "All" | ProjectCategory;

const categories: Category[] = ["All", "Residential Construction", "Residential Development", "Civil", "Hospitality", "Design/Build"];

const categoryColors: Record<string, string> = {
  "Residential Construction": "bg-gold text-charcoal",
  "Residential Development": "bg-steelBlue text-white",
  Civil: "bg-steelBlue text-white",
  Hospitality: "bg-burgundy text-white",
  "Design/Build": "bg-gold text-charcoal",
};

interface PortfolioGridProps {
  onClose: () => void;
  initialCategory?: string;
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = React.memo(({ onClose, initialCategory = "All" }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory as Category);
  const [isClosing, setIsClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Memoize filtered projects
  const filteredProjects = useMemo(() => {
    return getProjectsByCategory(selectedCategory);
  }, [selectedCategory]);

  // Memoize handleClose
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 600);
  }, [onClose]);

  // Memoize getCategoryCount
  const getCategoryCount = useCallback((category: Category) => {
    if (category === "All") return projects.length;
    return getProjectsByCategory(category).length;
  }, []);

  return (
    <div
      className={`fixed inset-0 z-40 overflow-y-auto transition-all duration-700 ${isClosing ? 'opacity-0' : 'opacity-100'
        }`}
    >
      {/* Elevated Luxury Background */}
      <div className="fixed inset-0 bg-[#FAFAFA] -z-10 overflow-hidden">
        {/* Soft, ambient gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold/10 blur-[120px] mix-blend-multiply opacity-60 animate-pulse-subtle" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-charcoal/5 blur-[120px] mix-blend-multiply opacity-40" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-steelBlue/5 blur-[100px] mix-blend-multiply opacity-30 animate-pulse-subtle [animation-delay:2s]" />

        {/* Premium subtle grain texture */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-normal bg-premium-noise" />
      </div>

      {/* Sticky Header with Logo and Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-charcoal/5'
          : 'bg-white/80 backdrop-blur-sm'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top bar with logo and back button */}
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <span className="font-playfair text-2xl sm:text-3xl font-semibold text-gold tracking-wider">
                MC
              </span>
            </Link>

            {/* Title */}
            <h1 className="absolute left-1/2 -translate-x-1/2 font-playfair text-lg md:text-xl font-medium text-charcoal tracking-wide">
              Portfolio
            </h1>

            {/* Back to Home */}
            <Button
              onClick={handleClose}
              variant="ghost"
              className="text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 font-inter text-sm gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </div>

          {/* Category Navigation */}
          <nav className="pb-3 md:pb-4 border-b border-charcoal/10 -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex justify-center gap-4 md:gap-8 min-w-max">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`relative pb-2 font-inter text-[10px] md:text-xs tracking-[0.15em] uppercase transition-all duration-300 whitespace-nowrap ${isActive
                      ? "text-gold font-medium"
                      : "text-charcoal/50 hover:text-charcoal/80"
                      }`}
                  >
                    <span>
                      {category}
                      <span className="ml-1.5 opacity-60">({getCategoryCount(category)})</span>
                    </span>
                    {isActive && (
                      <span className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-gold rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 md:py-12">
        {/* Category breadcrumb - shows when specific category selected */}
        {selectedCategory !== "All" && (
          <div className="mb-6 md:mb-8">
            <Button
              onClick={() => setSelectedCategory("All")}
              variant="ghost"
              size="sm"
              className="text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 font-inter text-xs gap-1.5 -ml-2"
            >
              <ArrowLeft className="h-3 w-3" />
              All Projects
            </Button>
          </div>
        )}

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 lg:gap-7 xl:gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              categoryColor={categoryColors[project.category]}
              index={index}
            />
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="mt-20 mb-8 text-center">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto" />
          <p className="mt-6 font-inter text-xs text-charcoal/40 tracking-wider uppercase">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
          </p>
        </div>
      </div>
    </div>
  );
});

PortfolioGrid.displayName = 'PortfolioGrid';
