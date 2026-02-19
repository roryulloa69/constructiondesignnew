import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import developmentCover from "@/assets/projects/development-cover.webp";

export const CTASection = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={developmentCover}
          alt="Construction Development"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-charcoal/85" />
      </div>

      {/* Content */}
      <div
        className={`relative container mx-auto px-6 lg:px-12 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-white font-light mb-6 max-w-3xl mx-auto leading-tight">
          Ready to Build Your{" "}
          <span className="italic text-gold">Dream Home?</span>
        </h2>
        <p className="font-inter text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Let's discuss your vision and create something extraordinary together.
          I'm ready to bring your ideas to life with unparalleled craftsmanship
          and attention to detail.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            className="bg-gold hover:bg-gold/90 text-charcoal font-inter text-sm tracking-wider px-10 py-6 uppercase"
          >
            <Link to="/contact">
              Start Your Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-inter text-sm tracking-wider px-10 py-6 uppercase"
          >
            <a href="tel:+14352377373">Call Now</a>
          </Button>
        </div>
      </div>
    </section>
  );
};
