import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useMouseParallax } from "@/hooks/useParallax";
import mikeProfile from "@/assets/michael-chandler.webp";

const stats = [
  { value: "$500M+", label: "Portfolio Managed" },
  { value: "37+", label: "Years Experience" },
  { value: "12", label: "US States" },
  { value: "4", label: "Countries" },
  { value: "±2%", label: "Budget Accuracy" },
  { value: "100%", label: "On-Time Delivery" },
];

export const AboutNew = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.2 });
  const mousePosition = useMouseParallax(0.015);

  return (
    <section
      id="about"
      ref={elementRef as React.RefObject<HTMLElement>}
      className="relative py-24 lg:py-32 bg-black text-white overflow-hidden"
    >
      {/* Floating Background Orbs with Mouse Parallax */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-gold/5 rounded-full blur-[120px] animate-float" />
        <div 
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-[100px] animate-float"
          style={{ animationDelay: '-2s' }}
        />
        <div 
          className="absolute top-1/2 right-1/6 w-48 h-48 bg-gold/3 rounded-full blur-[80px] animate-float"
          style={{ animationDelay: '-4s' }}
        />
      </div>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - Text Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Section Label */}
            <p className="font-inter text-xs tracking-[0.4em] text-gold uppercase mb-4">
              About Me
            </p>

            {/* Heading */}
            <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-light mb-8 leading-tight">
              A Unique{" "}
              <span className="italic text-gold">Perspective</span>
            </h2>

            {/* Description */}
            <div className="space-y-6 text-white/60 font-inter leading-relaxed">
              <p>
                Michael Chandler is a Strategic Construction Leader with over 37 years of experience 
                steering multimillion-dollar developments from conception to handover. His expertise 
                lies in navigating the complex challenges of modern construction — labor shortages, 
                technological integration, and international logistics — while consistently delivering 
                exceptional results for high-net-worth individuals and institutional developers.
              </p>
              <p>
                With a Bachelor of Architecture from the University of Austin and decades of hands-on 
                field experience, Michael possesses a rare ability to bridge high-level architectural 
                design with rigorous P&L stewardship and construction execution.
              </p>
              <p>
                Michael has successfully managed portfolios exceeding $500M across 12 US states and 
                4 countries, including complex international developments in the Bahamas, Mexico, and 
                Costa Rica. His native-level fluency in Spanish enables seamless communication with 
                international workforces and stakeholders.
              </p>
            </div>
          </div>

          {/* Right Column - Profile Image */}
          <div
            className={`relative transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-gold/20" />
              
              {/* Main Image */}
              <div className="relative overflow-hidden">
                <img
                  src={mikeProfile}
                  alt="Michael Chandler - Master Builder"
                  className="w-full aspect-[3/4] object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
              </div>

              {/* Name Card Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="font-playfair text-2xl sm:text-3xl text-white mb-1">
                  Michael Chandler
                </p>
                <p className="font-inter text-xs tracking-[0.3em] text-gold uppercase">
                  Strategic Construction Executive
                </p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-gold" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div
          ref={statsRef as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mt-24 pt-16 border-t border-white/10 transition-all duration-1000 ${
            statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="block font-playfair text-3xl sm:text-4xl lg:text-5xl text-gold font-light mb-2 transition-transform group-hover:scale-105">
                {stat.value}
              </span>
              <span className="font-inter text-[10px] sm:text-xs tracking-[0.25em] text-white/40 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative background text */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-playfair text-[20rem] text-gold/[0.03] font-light leading-none pointer-events-none hidden xl:block">
        MC
      </div>
    </section>
  );
};
