import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import local hero images
import alpineRanchCover from "@/assets/projects/alpine-ranch-cover.webp";
import bigsurCover from "@/assets/projects/bigsur-cover.webp";
import developmentCover from "@/assets/projects/development-cover.webp";
import carmelKnollsCover from "@/assets/projects/carmel-knolls-cover.webp";

const heroSlides = [
  {
    image: alpineRanchCover,
    alt: "High Alpine Mountain Ranch Montana",
  },
  {
    image: bigsurCover,
    alt: "Big Sur Mountain Remodel",
  },
  {
    image: developmentCover,
    alt: "Development Civil Project",
  },
  {
    image: carmelKnollsCover,
    alt: "Carmel Knolls Residence",
  },
];

interface HeroCarouselProps {
  onExplorePortfolio: () => void;
}

export const HeroCarousel = ({ onExplorePortfolio }: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, currentSlide]);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-charcoal">
      {/* Background Images */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
        </div>
      ))}

      {/* Main Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center z-10">
        {/* Subtitle */}
        <p className="font-inter text-xs sm:text-sm tracking-[0.4em] text-white/60 uppercase mb-6 animate-fade-in">
          Strategic Construction Executive
        </p>

        {/* Main Name */}
        <h1 className="mb-8">
          <span className="block font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-light tracking-wide mb-2">
            Michael
          </span>
          <span className="block font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gold italic font-light">
            Chandler
          </span>
        </h1>

        {/* Decorative line */}
        <div className="w-24 h-[2px] bg-gold/60 mb-10" />

        {/* Stats */}
        <div className="flex items-center gap-12 sm:gap-20 mb-12">
          <div className="text-center">
            <span className="block font-playfair text-4xl sm:text-5xl md:text-6xl text-gold font-light">
              $500M+
            </span>
            <span className="font-inter text-[10px] sm:text-xs tracking-[0.3em] text-white/50 uppercase">
              Portfolio Managed
            </span>
          </div>
          <div className="text-center">
            <span className="block font-playfair text-4xl sm:text-5xl md:text-6xl text-gold font-light">
              37+
            </span>
            <span className="font-inter text-[10px] sm:text-xs tracking-[0.3em] text-white/50 uppercase">
              Years Experience
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            onClick={onExplorePortfolio}
            className="bg-gold hover:bg-gold/90 text-charcoal font-inter text-sm tracking-wider px-10 py-6 uppercase"
          >
            Explore Portfolio
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-inter text-sm tracking-wider px-10 py-6 uppercase group"
          >
            <Link to="/contact">
              Start Inquiry
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Slide Indicators - Left side */}
      <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-6">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group flex items-center gap-3"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 h-[2px] bg-gold"
                  : "w-4 h-[1px] bg-white/30 group-hover:bg-white/60"
              }`}
            />
            <span
              className={`font-inter text-xs transition-opacity duration-300 ${
                index === currentSlide ? "text-gold opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"
              }`}
            >
              0{index + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Navigation Arrows - Right side */}
      <div className="absolute right-6 sm:right-10 bottom-10 z-20 flex items-center gap-2">
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all disabled:opacity-50"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all disabled:opacity-50"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom divider line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
};
