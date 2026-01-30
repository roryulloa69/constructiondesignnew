import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import mikeProfile from "@/assets/michael-chandler.webp";

export const AboutNew = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      id="about"
      ref={elementRef as React.RefObject<HTMLElement>}
      className="relative py-24 lg:py-32 bg-charcoal text-white overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - Text Content */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {/* Section Label */}
            <p className="font-inter text-xs tracking-[0.3em] text-gold uppercase mb-4">
              Established 1987
            </p>

            {/* Heading */}
            <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-light mb-8 leading-tight">
              A Unique{" "}
              <span className="italic text-gold">Perspective</span>
            </h2>

            {/* Description */}
            <div className="space-y-6 text-white/70 font-inter leading-relaxed">
              <p>
                Michael Chandler is a Strategic Construction Leader with over 37 years of experience
                steering multimillion-dollar developments from conception to handover. His expertise
                lies in navigating the complex challenges of modern construction — labor shortages,
                technological integration, and international logistics — while consistently delivering
                exceptional results for high-net-worth individuals and institutional developers.
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
            className={`relative transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative overflow-hidden">
                <img
                  src={mikeProfile}
                  alt="Michael Chandler - Master Builder"
                  className="w-full aspect-[3/4] object-cover grayscale-[30%]"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
              </div>

              {/* Name Card Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="font-playfair text-2xl sm:text-3xl text-white mb-1">
                  Michael Chandler
                </p>
                <p className="font-inter text-xs tracking-[0.2em] text-gold uppercase">
                  Strategic Construction Executive
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div
          ref={statsRef as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mt-20 pt-16 border-t border-white/10 transition-all duration-1000 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div className="text-center">
            <span className="block font-playfair text-3xl sm:text-4xl lg:text-5xl text-gold font-light mb-2">
              $500M+
            </span>
            <span className="font-inter text-xs tracking-[0.2em] text-white/50 uppercase">
              Portfolio Managed
            </span>
          </div>
          <div className="text-center">
            <span className="block font-playfair text-3xl sm:text-4xl lg:text-5xl text-gold font-light mb-2">
              37+
            </span>
            <span className="font-inter text-xs tracking-[0.2em] text-white/50 uppercase">
              Years Experience
            </span>
          </div>
          <div className="text-center">
            <span className="block font-playfair text-3xl sm:text-4xl lg:text-5xl text-gold font-light mb-2">
              12
            </span>
            <span className="font-inter text-xs tracking-[0.2em] text-white/50 uppercase">
              US States
            </span>
          </div>
          <div className="text-center">
            <span className="block font-playfair text-3xl sm:text-4xl lg:text-5xl text-gold font-light mb-2">
              4
            </span>
            <span className="font-inter text-xs tracking-[0.2em] text-white/50 uppercase">
              Countries
            </span>
          </div>
          <div className="text-center">
            <span className="block font-playfair text-3xl sm:text-4xl lg:text-5xl text-gold font-light mb-2">
              ±2%
            </span>
            <span className="font-inter text-xs tracking-[0.2em] text-white/50 uppercase">
              Budget Accuracy
            </span>
          </div>
          <div className="text-center">
            <span className="block font-playfair text-3xl sm:text-4xl lg:text-5xl text-gold font-light mb-2">
              100%
            </span>
            <span className="font-inter text-xs tracking-[0.2em] text-white/50 uppercase">
              On-Time Delivery
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
