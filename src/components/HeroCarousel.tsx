import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMouseParallax, useScrollTransform } from "@/hooks/useParallax";

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
  const mousePosition = useMouseParallax(0.015);
  const { scrollY, windowHeight } = useScrollTransform();

  // Calculate header opacity based on scroll (like Design page)
  const headerOpacity = Math.max(0, 1 - scrollY / (windowHeight * 0.5));

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
    <section className="relative h-screen w-full overflow-hidden bg-black selection:bg-white/20">
      {/* Floating Background Elements (matching Design page) */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]" 
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px] animate-float" />
        <div 
          className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-[80px] animate-float" 
          style={{ animationDelay: '-3s' }} 
        />
      </div>

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
            style={{
              transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
            }}
          />
          {/* Darker overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </div>
      ))}

      {/* Main Content - Centered with scroll-based opacity */}
      <div 
        className="relative h-full flex flex-col items-center justify-center text-center z-10 px-6"
        style={{
          opacity: headerOpacity,
          transform: `translateY(${scrollY * 0.15}px)`
        }}
      >
        {/* EST badge (like Design page) */}
        <p 
          className="font-inter text-xs tracking-[0.3em] text-gold/70 mb-4 animate-fade-left"
          style={{ animationDelay: '0.2s' }}
        >
          EST. 1987
        </p>

        {/* Subtitle */}
        <p 
          className="font-inter text-xs sm:text-sm tracking-[0.5em] text-white/60 uppercase mb-8 animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          Strategic Construction Executive
        </p>

        {/* Main Name with animated underline */}
        <div className="relative mb-10">
          <div className="overflow-hidden">
            <h1 
              className="font-playfair text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.15em] text-white uppercase animate-fade-up"
              style={{ animationDelay: '0.4s' }}
            >
              <span className="block font-light">Michael</span>
              <span className="block text-gold italic">Chandler</span>
            </h1>
          </div>
          
          {/* Animated underline (like Design page) */}
          <div className="absolute -bottom-4 left-0 right-0 h-[1px] bg-white/20">
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] bg-gold animate-reveal-left" 
              style={{ width: '40%', animationDelay: '0.8s' }} 
            />
          </div>
        </div>

        {/* CTAs */}
        <div 
          className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          <Button
            onClick={onExplorePortfolio}
            className="bg-white text-black hover:bg-gold hover:text-white px-10 py-6 text-sm tracking-widest uppercase rounded-none transition-all duration-500 group"
          >
            Explore Portfolio
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 hover:border-gold px-10 py-6 text-sm tracking-widest uppercase rounded-none transition-all duration-500 group"
          >
            <Link to="/contact">
              Start Inquiry
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>

        {/* Stats Bar */}
        <div 
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 animate-fade-up"
          style={{ animationDelay: '0.7s' }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center group p-4">
              <span className="block font-playfair text-3xl sm:text-4xl md:text-5xl text-gold font-light mb-2 transition-transform group-hover:scale-105">
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
      <div 
        className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4 mix-blend-difference"
        style={{ opacity: headerOpacity }}
      >
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
      <div 
        className="absolute right-6 sm:right-10 bottom-10 z-20 flex items-center gap-2"
        style={{ opacity: headerOpacity }}
      >
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

      {/* Scroll indicator (matching Design page) */}
      <div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        style={{ opacity: headerOpacity }}
      >
        <div className="w-[1px] h-8 bg-white/20 relative overflow-hidden">
          <div 
            className="absolute top-0 w-full h-4" 
            style={{
              background: 'linear-gradient(to bottom, transparent, hsl(var(--gold)), transparent)',
              animation: 'moveDown 1.5s ease-in-out infinite'
            }} 
          />
        </div>
      </div>

      {/* Custom CSS for scroll animation */}
      <style>{`
        @keyframes moveDown {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
};
