import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FooterNew } from "@/components/FooterNew";
import { getPlaceholderImage } from "@/lib/images";

// Use placeholder images
const detailOceanviewFraming = getPlaceholderImage("oceanview", "architecture");
const detailBronzeBase = getPlaceholderImage("bronze", "interior");
const detailPendantLighting = getPlaceholderImage("pendant", "interior");
const detailMarbleBath = getPlaceholderImage("marble", "interior");
const detailTimberBeams = getPlaceholderImage("timber", "architecture");
const detailLimestoneFireplace = getPlaceholderImage("fireplace", "interior");
const detailVanityNiche = getPlaceholderImage("vanity", "interior");
const detailProRange = getPlaceholderImage("range", "interior");
const detailSkiStorage = getPlaceholderImage("storage", "interior");
const detailSpaVanity = getPlaceholderImage("spa", "interior");
const detailLeatherCabinetry = getPlaceholderImage("leather", "interior");

const Design = () => {
  const navigate = useNavigate();

  // Animation hooks for different sections
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: grid1Ref, isVisible: grid1Visible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: grid2Ref, isVisible: grid2Visible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: grid3Ref, isVisible: grid3Visible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 z-50 p-6 sm:p-8 mix-blend-difference">
        <Button
          variant="ghost"
          className="text-white hover:text-white/70 hover:bg-transparent -ml-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          BACK
        </Button>
      </nav>

      {/* Header Section */}
      <section
        ref={headerRef as React.RefObject<HTMLElement>}
        className={`pt-32 pb-16 px-4 text-center transition-all duration-1000 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="relative inline-block">
          <h1 className="font-playfair text-5xl sm:text-7xl md:text-8xl tracking-[0.2em] text-white uppercase">
            Design
          </h1>
          <div className="absolute -bottom-4 left-0 right-0 h-[1px] bg-white/30">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-white" />
          </div>
          <p className="absolute -right-8 -top-4 font-inter text-xs tracking-[0.3em] text-white/50 hidden sm:block">
            EST. 1987
          </p>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-4 sm:space-y-6">
        
        {/* Row 1: Hero Image + Triptych */}
        <div 
          ref={grid1Ref as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 transition-all duration-1000 delay-200 ${
            grid1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Large Hero - Spans 8 cols */}
          <div className="lg:col-span-8 relative aspect-[16/10] overflow-hidden group">
            <img 
              src={detailOceanviewFraming} 
              alt="Ocean View" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>

          {/* Vertical Triptych - Spans 4 cols */}
          <div className="lg:col-span-4 grid grid-cols-3 gap-2 h-full min-h-[300px]">
            <div className="relative overflow-hidden group h-full">
              <img 
                src={detailBronzeBase} 
                alt="Detail 1" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="relative overflow-hidden group h-full mt-8 lg:mt-12">
              <img 
                src={detailPendantLighting} 
                alt="Detail 2" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="relative overflow-hidden group h-full">
              <img 
                src={detailMarbleBath} 
                alt="Detail 3" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Complex Grid */}
        <div 
          ref={grid2Ref as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-all duration-1000 delay-300 ${
            grid2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Column 1: Stacked */}
          <div className="space-y-4 sm:space-y-6">
            <div className="aspect-[4/5] relative overflow-hidden group">
              <img 
                src={detailTimberBeams} 
                alt="Timber Beams" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 text-xs font-inter tracking-widest text-white/80 uppercase">Architecture</div>
            </div>
            <div className="aspect-square relative overflow-hidden group">
              <img 
                src={detailLimestoneFireplace} 
                alt="Fireplace" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Column 2: Tall Feature */}
          <div className="aspect-[1/2] md:aspect-auto relative overflow-hidden group bg-charcoal">
             <img 
                src={detailVanityNiche} 
                alt="Modern Exterior" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[1px] h-24 bg-white/30" />
              </div>
          </div>

          {/* Column 3: Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="col-span-2 aspect-video relative overflow-hidden group">
               <img 
                src={detailProRange} 
                alt="Kitchen" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="aspect-[3/4] relative overflow-hidden group">
               <img 
                src={detailSkiStorage} 
                alt="Storage" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="aspect-[3/4] relative overflow-hidden group bg-white/5 flex items-center justify-center">
              <div className="text-center p-4">
                <span className="block font-playfair text-2xl mb-2">30+</span>
                <span className="text-[10px] uppercase tracking-widest text-white/60">Years of<br/>Design</span>
              </div>
            </div>
            <div className="col-span-2 aspect-square relative overflow-hidden group">
               <img 
                src={detailSpaVanity} 
                alt="Spa" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Bottom Feature */}
        <div 
          ref={grid3Ref as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 transition-all duration-1000 delay-400 ${
            grid3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="lg:col-span-4 flex flex-col justify-end p-6 sm:p-12 bg-white/5">
            <h3 className="font-playfair text-3xl mb-4">Curated Interiors</h3>
            <p className="font-inter text-sm text-white/60 leading-relaxed mb-8">
              Every detail is meticulously chosen to create a harmonious environment that reflects the unique character of the space and its inhabitants.
            </p>
            <div className="w-12 h-[1px] bg-white/30" />
          </div>
          <div className="lg:col-span-8 aspect-[21/9] relative overflow-hidden group">
            <img 
              src={detailLeatherCabinetry} 
              alt="Interior Detail" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
        </div>

      </div>

      {/* CTA Section */}
      <section
        ref={ctaRef as React.RefObject<HTMLElement>}
        className={`py-24 text-center transition-all duration-1000 ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <p className="font-inter text-xs tracking-[0.3em] text-white/50 uppercase mb-6">Start Your Project</p>
        <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl mb-8">Let's Create Together</h2>
        <Button
          onClick={() => navigate("/contact")}
          className="bg-white text-black hover:bg-white/90 px-8 py-6 text-sm tracking-widest uppercase rounded-none"
        >
          Get in Touch
        </Button>
      </section>

      <FooterNew />
    </div>
  );
};

export default Design;
