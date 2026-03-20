import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Text-based logo component
const LogoText = ({ className = "" }: { className?: string }) => (
  <span className={`font-playfair text-3xl font-semibold tracking-tight ${className}`}>
    <span className="text-gold">MC</span>
    <span className="text-charcoal/80 font-light ml-1">Design</span>
  </span>
);

interface BookCoverHeroProps {
  onOpenBook: () => void;
}

export const BookCoverHero: React.FC<BookCoverHeroProps> = ({ onOpenBook }) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      className="relative py-20 lg:py-32 bg-[#FAF9F7]"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`mb-16 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <span className="font-playfair text-8xl lg:text-[10rem] text-gold/10 font-light leading-none block">
            04
          </span>
          <p className="font-inter text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3 -mt-8 lg:-mt-16">
            Portfolio
          </p>
          <h2 className="font-playfair text-3xl lg:text-4xl text-foreground">Explore My Work</h2>
        </div>

        {/* Book Cover */}
        <div className={`flex justify-center transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
          <div className="relative group cursor-pointer" onClick={onOpenBook}>
            {/* Book shadow */}
            <div className="absolute inset-0 bg-black/20 blur-2xl translate-y-8 group-hover:translate-y-12 group-hover:blur-3xl transition-all duration-500" />

            {/* Book cover */}
            <div className="relative w-[320px] sm:w-[400px] h-[480px] sm:h-[560px] bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border border-gold/20 overflow-hidden transform group-hover:scale-[1.02] group-hover:-translate-y-2 transition-all duration-500">
              {/* Texture */}
              <div className="absolute inset-0 opacity-10 bg-book-texture" />

              {/* Spine */}
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/50 to-transparent" />

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-8">
                {/* Logo */}
                <img src={logo} alt="MC Logo" className="h-40 sm:h-48 w-auto mb-8" />

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-px bg-gold/40" />
                  <div className="w-2 h-2 rotate-45 border border-gold/40" />
                  <div className="w-12 h-px bg-gold/40" />
                </div>

                {/* Text */}
                <p className="font-inter text-white/70 text-sm tracking-[0.25em] uppercase mb-8">
                  Fine Construction & Design
                </p>

                {/* Button */}
                <Button className="bg-gold hover:bg-gold/90 text-white px-8 py-3 font-inter text-sm tracking-wide">
                  Open Portfolio
                </Button>
              </div>

              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-gold/30" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-gold/30" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-gold/30" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-gold/30" />
            </div>
          </div>
        </div>

        {/* Alternative CTA */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <p className="font-inter text-muted-foreground mb-4">Or browse directly</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background" onClick={onOpenBook}>
              View All Projects
            </Button>
            <Button asChild variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background">
              <Link to="/design">Design Concepts</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
