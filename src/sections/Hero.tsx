import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";


const heroSlides = [
    {
        image: getPlaceholderImage("alpine-ranch-hero", "architecture"),
        alt: "High Alpine Mountain Ranch Montana",
    },
    {
        image: getPlaceholderImage("bigsur-hero", "architecture"),
        alt: "Big Sur Mountain Remodel",
    },
    {
        image: getPlaceholderImage("development-hero", "construction"),
        alt: "Development Civil Project",
    },
    {
        image: getPlaceholderImage("carmel-knolls-hero", "architecture"),
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
            {/* Background Images with Ken Burns Effect */}
            {heroSlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${index === currentSlide ? "opacity-100 z-0" : "opacity-0 -z-10"
                        }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.alt}
                        className={`w-full h-full object-cover transition-transform duration-[12000ms] ease-linear ${index === currentSlide ? "scale-110" : "scale-100"
                            }`}
                        loading={index === 0 ? "eager" : "lazy"}
                    />
                    {/* Cinematic Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-transparent to-transparent" />
                </div>
            ))}

            {/* Subtle vignette */}
            <div className="absolute inset-0 z-[5] pointer-events-none" style={{ boxShadow: 'inset 0 0 200px rgba(0,0,0,0.4)' }} />

            {/* Content Container */}
            <div className="relative h-full flex flex-col items-center justify-center z-20 px-6 sm:px-12">
                <div className="max-w-4xl w-full text-center">
                    {/* Subtitle */}
                    <div className="overflow-hidden mb-8">
                        <p className="font-inter text-[10px] sm:text-xs tracking-[0.6em] text-gold/90 uppercase animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300 fill-mode-both">
                            Strategic Construction Executive
                        </p>
                    </div>

                    {/* Main Name */}
                    <h1 className="mb-12 select-none">
                        <span className="block font-playfair text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] text-white font-extralight tracking-[-0.02em] leading-[0.9] mb-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
                            Michael
                        </span>
                        <span className="block font-playfair text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] text-gold italic font-extralight tracking-[-0.02em] leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both">
                            Chandler
                        </span>
                    </h1>

                    {/* Decorative line */}
                    <div className="flex justify-center mb-14 animate-in fade-in zoom-in duration-1000 delay-1000 fill-mode-both">
                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                    </div>

                    {/* Stats */}
                    <div className="flex justify-center gap-16 sm:gap-28 mb-16 animate-in fade-in duration-1000 delay-1200 fill-mode-both">
                        <div className="flex flex-col items-center">
                            <span className="font-playfair text-3xl sm:text-4xl text-white font-extralight tracking-tight mb-1">$500M+</span>
                            <span className="font-inter text-[9px] tracking-[0.3em] text-white/35 uppercase">Portfolio</span>
                        </div>
                        <div className="w-px h-14 bg-white/10 self-center" />
                        <div className="flex flex-col items-center">
                            <span className="font-playfair text-3xl sm:text-4xl text-white font-extralight tracking-tight mb-1">37+ Years</span>
                            <span className="font-inter text-[9px] tracking-[0.3em] text-white/35 uppercase">Expertise</span>
                        </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-1500 fill-mode-both">
                        <Button
                            onClick={onExplorePortfolio}
                            className="min-w-[220px] h-16 bg-gold hover:bg-gold-dark text-white font-inter text-[10px] tracking-[0.3em] uppercase rounded-none transition-all duration-500 hover:tracking-[0.35em] shadow-[0_0_40px_rgba(197,165,114,0.15)]"
                        >
                            Explore Portfolio
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="min-w-[220px] h-16 border-white/15 text-white hover:bg-white/5 hover:border-white/30 font-inter text-[10px] tracking-[0.3em] uppercase rounded-none group transition-all duration-500"
                        >
                            <Link to="/contact">
                                Start Inquiry
                                <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                            className={`w-[2px] h-10 transition-all duration-700 ${index === currentSlide ? "bg-gold scale-y-100" : "bg-white/10 scale-y-50 group-hover:bg-white/30"
                                }`}
                        />
                        <span
                            className={`absolute left-6 font-inter text-[10px] tracking-widest transition-all duration-700 whitespace-nowrap ${index === currentSlide ? "text-gold opacity-100 translate-x-0" : "text-white opacity-0 -translate-x-2 group-hover:opacity-40"
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
                        className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-gold/40 hover:bg-gold/5 transition-all duration-500 disabled:opacity-30"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={isTransitioning}
                        className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-gold/40 hover:bg-gold/5 transition-all duration-500 disabled:opacity-30"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-3 animate-in fade-in duration-1000 delay-[2000ms] fill-mode-both">
                <span className="font-inter text-[9px] tracking-[0.4em] text-white/30 uppercase">Scroll</span>
                <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
            </div>

            {/* Bottom gradient for seamless transition */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-charcoal to-transparent z-10" />
        </section>
    );
};
