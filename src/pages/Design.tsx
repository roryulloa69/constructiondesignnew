import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallax, useMouseParallax, useScrollTransform } from "@/hooks/useParallax";
import { FooterNew } from "@/components/FooterNew";
import { useEffect, useRef, useState } from "react";

// Import images from existing assets - using confirmed cover images
import detailOceanviewFraming from "@/assets/projects/abaco-luxe-boathouse-cover.webp";
import detailBronzeBase from "@/assets/projects/alpine-ranch-cover.webp";
import detailPendantLighting from "@/assets/projects/bigsur-cover.webp";
import detailMarbleBath from "@/assets/projects/carmel-knolls-cover.webp";
import detailTimberBeams from "@/assets/projects/carmel-valley-cover.webp";
import detailLimestoneFireplace from "@/assets/projects/civil-cover.webp";
import detailVanityNiche from "@/assets/projects/cleanup-cover.webp";
import detailProRange from "@/assets/projects/coastal-restoration-cover.webp";
import detailSkiStorage from "@/assets/projects/development-cover.webp";
import detailSpaVanity from "@/assets/projects/hillside-cover.webp";
import detailLeatherCabinetry from "@/assets/projects/laguna-cover.webp";

// Category Label component
const CategoryLabel = ({ 
  label, 
  position = "bottom-left",
  vertical = false 
}: { 
  label: string; 
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right" | "center";
  vertical?: boolean;
}) => {
  const positionClasses = {
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} z-20 pointer-events-none`}
      style={vertical ? { writingMode: 'vertical-rl', textOrientation: 'mixed' } : {}}
    >
      <span className="font-inter text-[10px] sm:text-xs tracking-[0.3em] text-white/90 uppercase bg-black/40 backdrop-blur-sm px-3 py-1.5 border border-white/10">
        {label}
      </span>
    </div>
  );
};

// Animated image component with parallax and label
const ParallaxImage = ({ 
  src, 
  alt, 
  className = "",
  parallaxSpeed = 0.3,
  delay = 0,
  label,
  labelPosition = "bottom-left",
  labelVertical = false
}: { 
  src: string; 
  alt: string; 
  className?: string;
  parallaxSpeed?: number;
  delay?: number;
  label?: string;
  labelPosition?: "bottom-left" | "bottom-right" | "top-left" | "top-right" | "center";
  labelVertical?: boolean;
}) => {
  const { elementRef, offset } = useParallax({ speed: parallaxSpeed });
  const { elementRef: animRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const combinedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (combinedRef.current) {
      (elementRef as React.MutableRefObject<HTMLElement | null>).current = combinedRef.current;
      (animRef as React.MutableRefObject<HTMLElement | null>).current = combinedRef.current;
    }
  }, [elementRef, animRef]);

  return (
    <div 
      ref={combinedRef}
      className={`relative overflow-hidden group ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : 60}px)`,
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`
      }}
    >
      <div 
        className="absolute inset-0 transition-transform duration-700"
        style={{ transform: `translateY(${offset}px) scale(1.1)` }}
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
      
      {/* Category Label */}
      {label && (
        <CategoryLabel label={label} position={labelPosition} vertical={labelVertical} />
      )}
    </div>
  );
};

// Animated text component
const AnimatedText = ({ 
  children, 
  delay = 0,
  className = "",
  animation = "fade-up"
}: { 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
  animation?: "fade-up" | "fade-left" | "fade-right" | "blur-in";
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const getTransform = () => {
    if (!isVisible) {
      switch (animation) {
        case "fade-left": return "translateX(40px)";
        case "fade-right": return "translateX(-40px)";
        case "blur-in": return "translateY(20px)";
        default: return "translateY(40px)";
      }
    }
    return "translate(0)";
  };

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        filter: animation === "blur-in" && !isVisible ? "blur(10px)" : "blur(0)",
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s, filter 0.8s ease-out ${delay}s`
      }}
    >
      {children}
    </div>
  );
};

// Counter animation component
const AnimatedCounter = ({ 
  value, 
  suffix = "",
  label 
}: { 
  value: number; 
  suffix?: string;
  label: string;
}) => {
  const [count, setCount] = useState(0);
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.5 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className="text-center p-4"
    >
      <span className="block font-playfair text-3xl sm:text-4xl mb-2">
        {count}{suffix}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-white/60">
        {label}
      </span>
    </div>
  );
};

const Design = () => {
  const navigate = useNavigate();
  const mousePosition = useMouseParallax(0.015);
  const { scrollY, windowHeight } = useScrollTransform();

  // Calculate header opacity based on scroll
  const headerOpacity = Math.max(0, 1 - scrollY / (windowHeight * 0.3));

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
      {/* Floating Background Elements */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-[80px] animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 z-50 p-6 sm:p-8 mix-blend-difference">
        <Button
          variant="ghost"
          className="text-white hover:text-white/70 hover:bg-transparent -ml-4 transition-all duration-300 hover:translate-x-[-4px]"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          BACK
        </Button>
      </nav>

      {/* Header Section with Parallax */}
      <section
        className="pt-32 pb-16 px-4 text-center relative z-10"
        style={{
          opacity: headerOpacity,
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      >
        <div className="relative inline-block">
          <div className="overflow-hidden">
            <h1 
              className="font-playfair text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.2em] text-white uppercase animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              Design
            </h1>
          </div>
          
          {/* Animated underline */}
          <div className="absolute -bottom-4 left-0 right-0 h-[1px] bg-white/30">
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] bg-gold animate-reveal-left"
              style={{ 
                width: '33%',
                animationDelay: '0.6s'
              }} 
            />
          </div>
          
          <p 
            className="absolute -right-8 -top-4 font-inter text-xs tracking-[0.3em] text-gold/70 hidden sm:block animate-fade-left"
            style={{ animationDelay: '0.8s' }}
          >
            EST. 1987
          </p>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up"
          style={{ 
            animationDelay: '1s',
            opacity: headerOpacity 
          }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll to explore</span>
          <div className="w-[1px] h-8 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 w-full h-4 bg-gold animate-[shimmer_1.5s_ease-in-out_infinite]" 
              style={{ 
                background: 'linear-gradient(to bottom, transparent, hsl(var(--gold)), transparent)',
                animation: 'moveDown 1.5s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-8 sm:space-y-12 relative z-10">
        
        {/* Row 1: Architecture + Interiors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Large Hero - Architecture */}
          <ParallaxImage 
            src={detailOceanviewFraming}
            alt="Architecture"
            className="lg:col-span-8 aspect-[16/10]"
            parallaxSpeed={0.2}
            delay={0}
            label="Architecture"
            labelPosition="top-left"
          />

          {/* Vertical Triptych - Interiors */}
          <div className="lg:col-span-4 grid grid-cols-3 gap-2 min-h-[300px]">
            <ParallaxImage 
              src={detailBronzeBase}
              alt="Interior 1"
              className="h-full"
              parallaxSpeed={0.4}
              delay={0.1}
              label="Interiors"
              labelPosition="top-left"
            />
            <div className="mt-8 lg:mt-12">
              <ParallaxImage 
                src={detailPendantLighting}
                alt="Interior 2"
                className="h-full"
                parallaxSpeed={0.3}
                delay={0.2}
              />
            </div>
            <ParallaxImage 
              src={detailMarbleBath}
              alt="Interior 3"
              className="h-full"
              parallaxSpeed={0.5}
              delay={0.3}
            />
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedText delay={0} animation="fade-right">
            <p className="font-inter text-xs tracking-[0.3em] text-gold/70 uppercase mb-4">Philosophy</p>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">
              Where Form Meets
              <br />
              <span className="text-gold">Timeless Function</span>
            </h2>
          </AnimatedText>
          <AnimatedText delay={0.2} animation="fade-left">
            <p className="font-inter text-white/60 leading-relaxed text-lg">
              Every space tells a story. Our design philosophy centers on creating environments 
              that transcend trends—spaces that feel both contemporary and eternal, crafted with 
              an unwavering commitment to quality and detail.
            </p>
          </AnimatedText>
        </div>

        {/* Row 2: Reimagined + Development + Pools & Landscape */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Column 1: Reimagined (Before & After) */}
          <div className="space-y-4 sm:space-y-6">
            <ParallaxImage 
              src={detailTimberBeams}
              alt="Reimagined Before & After"
              className="aspect-[4/5]"
              parallaxSpeed={0.25}
              delay={0}
              label="Reimagined"
              labelPosition="top-left"
            />
            <ParallaxImage 
              src={detailLimestoneFireplace}
              alt="Reimagined Detail"
              className="aspect-square"
              parallaxSpeed={0.35}
              delay={0.1}
              label="Before & After"
              labelPosition="bottom-left"
            />
          </div>

          {/* Column 2: Development */}
          <div className="relative">
            <ParallaxImage 
              src={detailVanityNiche}
              alt="Development"
              className="h-full min-h-[500px]"
              parallaxSpeed={0.2}
              delay={0.15}
              label="Development"
              labelPosition="top-left"
            />
          </div>

          {/* Column 3: Pools & Landscape + Concepts */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <ParallaxImage 
              src={detailProRange}
              alt="Pools & Landscape"
              className="col-span-2 aspect-video"
              parallaxSpeed={0.3}
              delay={0.2}
              label="Pools & Landscape"
              labelPosition="top-left"
            />
            <ParallaxImage 
              src={detailSkiStorage}
              alt="Concepts"
              className="aspect-[3/4]"
              parallaxSpeed={0.4}
              delay={0.25}
              label="Concepts"
              labelPosition="bottom-left"
            />
            <div className="aspect-[3/4] bg-white/5 flex items-center justify-center relative overflow-hidden group">
              <div 
                className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <AnimatedCounter 
                value={37}
                suffix="+"
                label="Years of Design Excellence"
              />
            </div>
            <ParallaxImage 
              src={detailSpaVanity}
              alt="Spa & Wellness"
              className="col-span-2 aspect-square"
              parallaxSpeed={0.25}
              delay={0.3}
            />
          </div>
        </div>

        {/* Row 3: Custom Furniture Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <AnimatedText 
            delay={0}
            animation="fade-up"
            className="lg:col-span-4 flex flex-col justify-end p-6 sm:p-12 bg-white/5 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <h3 className="font-playfair text-3xl sm:text-4xl mb-4 relative z-10">Custom Furniture</h3>
            <p className="font-inter text-sm text-white/60 leading-relaxed mb-8 relative z-10">
              Bespoke pieces crafted to complement and enhance your unique space. Each piece is designed with intention and built to last generations.
            </p>
            <div className="w-12 h-[1px] bg-gold/50 relative z-10" />
          </AnimatedText>
          <ParallaxImage 
            src={detailLeatherCabinetry}
            alt="Custom Furniture"
            className="lg:col-span-8 aspect-[21/9]"
            parallaxSpeed={0.15}
            delay={0.2}
            label="Custom Furniture"
            labelPosition="top-right"
          />
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 text-center relative z-10 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(var(--gold) / 0.1) 0%, transparent 70%)'
          }}
        />
        <AnimatedText delay={0} animation="blur-in">
          <p className="font-inter text-xs tracking-[0.3em] text-gold/70 uppercase mb-6">Start Your Project</p>
        </AnimatedText>
        <AnimatedText delay={0.15} animation="fade-up">
          <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8">Let's Create Together</h2>
        </AnimatedText>
        <AnimatedText delay={0.3} animation="fade-up">
          <Button
            onClick={() => navigate("/contact")}
            className="bg-white text-black hover:bg-gold hover:text-white px-8 py-6 text-sm tracking-widest uppercase rounded-none transition-all duration-500 group"
          >
            Get in Touch
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
          </Button>
        </AnimatedText>
      </section>

      <FooterNew />

      {/* Custom CSS for scroll animation */}
      <style>{`
        @keyframes moveDown {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(200%); }
        }
      `}</style>
    </div>
  );
};

export default Design;
