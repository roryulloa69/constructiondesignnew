import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SplineHero } from "@/components/SplineHero";

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

interface HeroProps {
    onExplorePortfolio: () => void;
}

export const Hero = ({ onExplorePortfolio }: HeroProps) => {
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
        const timer = setInterval(nextSlide, 8000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-charcoal">
            {/* Background Images with Zoom Effect */}
            {heroSlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-0" : "opacity-0 -z-10"
                        }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.alt}
                        className={`w-full h-full object-contain transition-transform duration-[8000ms] ease-linear ${index === currentSlide ? "scale-110" : "scale-100"
                            }`}
                        loading={index === 0 ? "eager" : "lazy"}
                    />
                    {/* Refined Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent opacity-80" />
                    <div className="absolute inset-0 bg-charcoal/20" />
                </div>
            ))}

            {/* Spline 3D Integration */}
            <SplineHero />

            {/* Content Container */}
            <div className="relative h-full flex flex-col items-center justify-center z-20 px-6 sm:px-12">
                <div className="max-w-4xl w-full text-center">
                    {/* Subtitle with reveal animation */}
                    <div className="overflow-hidden mb-6">
                        <p className="font-inter text-xs sm:text-sm tracking-[0.5em] text-gold/80 uppercase animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300 fill-mode-both">
                            Strategic Construction Executive
                        </p>
                    </div>

                    {/* Main Name with split-second delay for premium feel */}
                    <h1 className="mb-10 select-none">
                        <span className="block font-playfair text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-light tracking-tight leading-none mb-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
                            Michael
                        </span>
                        <span className="block font-playfair text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-gold italic font-light leading-none animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both">
                            Chandler
                        </span>
                    </h1>

                    {/* Decorative element */}
                    <div className="flex justify-center mb-12 animate-in fade-in zoom-in duration-1000 delay-1000 fill-mode-both">
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                    </div>

                    {/* High-level stats - simplified for Hero */}
                    <div className="flex justify-center gap-12 sm:gap-24 mb-14 animate-in fade-in duration-1000 delay-1200 fill-mode-both">
                        <div className="flex flex-col items-center">
                            <span className="font-playfair text-3xl sm:text-4xl text-white font-light mb-1">$500M+</span>
                            <span className="font-inter text-[10px] tracking-[0.2em] text-white/40 uppercase">Portfolio</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-playfair text-3xl sm:text-4xl text-white font-light mb-1">37+ Years</span>
                            <span className="font-inter text-[10px] tracking-[0.2em] text-white/40 uppercase">Expertise</span>
                        </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-1500 fill-mode-both">
                        <Button
                            onClick={onExplorePortfolio}
                            className="min-w-[200px] h-14 bg-gold hover:bg-gold/90 text-charcoal font-inter text-xs tracking-[0.2em] uppercase rounded-none transition-all duration-300 hover:tracking-[0.25em]"
                        >
                            Explore Portfolio
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="min-w-[200px] h-14 border-white/20 text-white hover:bg-white/5 hover:border-white/40 font-inter text-xs tracking-[0.2em] uppercase rounded-none group transition-all duration-300"
                        >
                            <Link to="/contact">
                                Start Inquiry
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Side Slide Indicators */}
            <div className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-8">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className="group relative flex items-center py-2"
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <div
                            className={`w-[2px] h-10 transition-all duration-500 ${index === currentSlide ? "bg-gold scale-y-100" : "bg-white/10 scale-y-50 group-hover:bg-white/30"
                                }`}
                        />
                        <span
                            className={`absolute left-6 font-inter text-[10px] tracking-widest transition-all duration-500 whitespace-nowrap ${index === currentSlide ? "text-gold opacity-100 translate-x-0" : "text-white opacity-0 -translate-x-2 group-hover:opacity-40"
                                }`}
                        >
                            PROJECT 0{index + 1}
                        </span>
                    </button>
                ))}
            </div>

            {/* Bottom Navigation Control */}
            <div className="absolute bottom-12 right-6 lg:right-12 z-30 flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <button
                        onClick={prevSlide}
                        disabled={isTransitioning}
                        className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all disabled:opacity-30"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={isTransitioning}
                        className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all disabled:opacity-30"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Aesthetic Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-charcoal to-transparent z-10" />
        </section>
    );
};
