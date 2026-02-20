import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DecorativeSeparator } from "@/components/DecorativeSeparator";

interface AboutProps {
  onPortfolioClick?: () => void;
}

export const About = ({ onPortfolioClick }: AboutProps) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      id="about"
      ref={elementRef as React.RefObject<HTMLElement>}
      className="relative py-20 lg:py-32 bg-[#FAF9F7]"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`mb-16 lg:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <span className="font-playfair text-8xl lg:text-[10rem] text-gold/10 font-light leading-none block -mb-6 lg:-mb-12">
            02
          </span>
          <p className="font-inter text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">About</p>
          <h2 className="font-playfair text-3xl lg:text-4xl text-foreground">Who I Am</h2>
        </div>

        {/* Main Content Grid */}
        <div
          ref={contentRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
        >
          {/* Left Column - Main Text */}
          <div className={`lg:col-span-7 transition-all duration-1000 ${contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}>
            <div className="border-l-2 border-gold/40 pl-8">
              <p className="font-inter text-lg lg:text-xl text-foreground/90 leading-relaxed mb-6">
                With <span className="text-gold font-semibold">architecture studies</span> from University of Austin and <span className="text-gold font-semibold">37+ years</span> of hands-on field experience, I transitioned from academic pursuit to direct industry engagement to capitalize on business opportunities and provide family support—a decision that shaped my unique ability to bridge high-level architectural design with rigorous P&L stewardship and construction execution.
              </p>
              <p className="font-inter text-foreground/70 leading-relaxed mb-6">
                I specialize in navigating the complex challenges of modern construction—labor shortages, technological integration, and international logistics—while consistently delivering exceptional results for high-net-worth individuals and institutional developers.
              </p>
              <p className="font-inter text-foreground/70 leading-relaxed mb-6">
                My portfolio exceeds <span className="text-gold font-semibold">$500M</span> across 12 US states and 4 countries, including developments in the Bahamas, Mexico, and Costa Rica. Native-level fluency in Spanish enables seamless communication with international workforces and stakeholders.
              </p>
              <p className="font-playfair text-lg italic text-foreground/60">
                — Michael Chandler
              </p>
            </div>
          </div>

          {/* Right Column - Philosophy Cards */}
          <div className={`lg:col-span-5 space-y-6 transition-all duration-1000 delay-200 ${contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}>
            {/* Philosophy Card */}
            <div className="bg-white p-8 shadow-luxury hover:shadow-luxury-lg transition-shadow duration-300">
              <span className="font-playfair text-4xl text-gold/30 font-light block mb-4">01</span>
              <h3 className="font-playfair text-xl text-foreground mb-3">My Philosophy</h3>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                Superior construction is accomplished through assembling the right team, empowering them with respect, and providing supportive leadership with real-time feedback.
              </p>
            </div>

            {/* Commitment Card */}
            <div className="bg-white p-8 shadow-luxury hover:shadow-luxury-lg transition-shadow duration-300">
              <span className="font-playfair text-4xl text-gold/30 font-light block mb-4">02</span>
              <h3 className="font-playfair text-xl text-foreground mb-3">My Commitment</h3>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                Every client, every project, every time: dedicated to exceeding expectations. Excellence isn't just a goal—it's the standard.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button asChild className="bg-foreground hover:bg-foreground/90 text-background w-full py-3">
                <Link to="/" state={{ openPortfolio: true }}>View My Work</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Separator */}
        <DecorativeSeparator />
      </div>
    </section>
  );
};
