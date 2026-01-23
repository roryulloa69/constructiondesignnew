import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import developmentCover from "@/assets/projects/development-cover.webp";

export const CTASection = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      className="relative py-32 lg:py-40 overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={developmentCover}
          alt="Construction Development"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/85 to-charcoal/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/50" />
      </div>

      {/* Content */}
      <div
        className={`relative container mx-auto px-6 lg:px-12 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-3xl">
          {/* Label */}
          <p className="font-inter text-xs tracking-[0.4em] text-gold uppercase mb-6">
            Let's Build Together
          </p>

          {/* Heading */}
          <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white font-light mb-8 leading-tight">
            Ready to Transform Your{" "}
            <span className="italic text-gold">Vision</span> into Reality?
          </h2>

          {/* Description */}
          <p className="font-inter text-lg text-white/60 mb-12 leading-relaxed max-w-xl">
            Let's discuss your project and create something extraordinary together.
            With over 37 years of experience, I'm ready to bring your ideas to life.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button
              asChild
              className="bg-gold hover:bg-gold-dark text-charcoal font-inter text-sm tracking-widest px-10 py-6 uppercase transition-all duration-300 group"
            >
              <Link to="/contact">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:border-gold font-inter text-sm tracking-widest px-10 py-6 uppercase transition-all duration-300 group"
            >
              <a href="tel:+14352377373">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[1px] bg-gradient-to-l from-gold/50 to-transparent hidden lg:block" />
      <div className="absolute right-[10%] bottom-20 font-playfair text-[12rem] text-gold/5 font-light hidden lg:block">
        MC
      </div>
    </section>
  );
};
