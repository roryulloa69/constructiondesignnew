import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/michael-chandler-portfolio.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
export const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const {
    elementRef,
    isVisible
  } = useScrollAnimation({
    threshold: 0.1
  });
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <section ref={elementRef as React.RefObject<HTMLElement>} className="relative min-h-screen w-full overflow-hidden">
    {/* Background Image */}
    <div className="absolute inset-0">
      <img src={heroImage} alt="Michael Chandler - 37 years of quality craftsmanship" width={1920} height={1080} className="w-full h-full object-cover object-center transition-transform duration-100 ease-out" style={{
        transform: `translateY(${scrollY * 0.3}px)`
      }} loading="eager" fetchPriority="high" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
    </div>

    {/* Hero Content */}
    <div className="relative h-screen flex items-center">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Large decorative number */}
          <span className={`font-playfair text-[8rem] lg:text-[12rem] text-white/10 font-light leading-none block -mb-16 lg:-mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            01
          </span>

          {/* Main heading */}
          <div className="">
            <p className="font-inter text-xs tracking-[0.3em] text-white/60 uppercase mb-4">
              Design • Build • Develop
            </p>
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
              Michael Chandler
            </h1>
            <div className="w-16 h-[2px] bg-gold mb-6" />
            <p className="text-white/80 leading-relaxed max-w-lg mb-8 font-light text-lg">
              Strategic Construction Executive with 37+ years of experience delivering multimillion-dollar developments for the world's most discerning clients. Portfolio exceeding $500M across 12 US states and 4 countries.
            </p>
          </div>

          {/* CTAs */}
          <div className={`flex flex-wrap gap-4 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
            <Button
              onClick={() => {
                const portfolioSection = document.getElementById('portfolio-trigger');
                if (portfolioSection) {
                  portfolioSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-gold hover:bg-gold/90 text-white px-8 py-3 shadow-[0_0_20px_rgba(208,165,102,0.3)] hover:shadow-[0_0_30px_rgba(208,165,102,0.5)] transition-all duration-300"
            >
              View Portfolio
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-3 backdrop-blur-sm transition-all duration-300"
            >
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex flex-col items-center gap-2">
        <span className="font-inter text-xs text-white/50 uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </div>
  </section>;
};