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

const stats = [
  { value: "$500M+", label: "Portfolio Managed" },
  { value: "37+", label: "Years Experience" },
  { value: "12", label: "US States" },
  { value: "4", label: "Countries" },
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
            className="w-full h-full object-cover scale-105"
            loading={index === 0 ? "eager" : "lazy"}
          />
          {/* Darker overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </div>
      ))}

      {/* Main Content - Centered */}
      <div className="relative h-full flex flex-col items-center justify-center text-center z-10 px-6">
        {/* Subtitle */}
        <p className="font-inter text-xs sm:text-sm tracking-[0.5em] text-gold uppercase mb-8 animate-fade-in">
          Strategic Construction Executive
        </p>

        {/* Main Name */}
        <h1 className="mb-6">
          <span className="block font-playfair text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-light tracking-wider">
            Michael
          </span>
          <span className="block font-playfair text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-gold italic font-light tracking-wider">
            Chandler
          </span>
        </h1>

        {/* Tagline */}
        <p className="font-inter text-sm sm:text-base text-white/60 tracking-wide mb-12 max-w-xl">
          Transforming visions into architectural masterpieces with unparalleled precision and craftsmanship
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Button
            onClick={onExplorePortfolio}
            className="bg-gold hover:bg-gold-dark text-charcoal font-inter text-sm tracking-widest px-12 py-6 uppercase transition-all duration-300"
          >
            Explore Portfolio
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/40 text-white hover:bg-white/10 hover:border-white font-inter text-sm tracking-widest px-12 py-6 uppercase group transition-all duration-300"
          >
            <Link to="/contact">
              Start Inquiry
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <span className="block font-playfair text-3xl sm:text-4xl md:text-5xl text-gold font-light transition-transform group-hover:scale-105">
                {stat.value}
              </span>
              <span className="font-inter text-[10px] sm:text-xs tracking-[0.25em] text-white/50 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators - Left side vertical */}
      <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
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
                  : "w-3 h-[1px] bg-white/30 group-hover:bg-white/60 group-hover:w-5"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Navigation Arrows - Bottom right */}
      <div className="absolute right-6 sm:right-10 bottom-10 z-20 flex items-center gap-2">
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="w-12 h-12 border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-gold hover:bg-gold/10 transition-all disabled:opacity-50"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="w-12 h-12 border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-gold hover:bg-gold/10 transition-all disabled:opacity-50"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-float">
        <span className="font-inter text-[10px] tracking-[0.3em] text-white/40 uppercase">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
};
