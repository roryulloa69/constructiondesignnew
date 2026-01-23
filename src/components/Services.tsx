import { Compass, PenLine, HardHat, ListChecks, BadgeCheck, Sprout } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Service {
  icon: typeof Compass;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: BadgeCheck,
    title: "Owner's Representation",
    description: "Acting as your trusted advocate throughout the construction process, ensuring your vision is executed with precision while protecting your investment.",
  },
  {
    icon: ListChecks,
    title: "Project Management",
    description: "Full-cycle oversight from permitting to final inspections, maintaining rigorous quality standards and budget discipline across complex developments.",
  },
  {
    icon: PenLine,
    title: "Design-Build Consulting",
    description: "Leveraging architectural expertise to bridge the gap between design intent and constructability, eliminating costly change orders and delays.",
  },
  {
    icon: Compass,
    title: "International Logistics",
    description: "Navigating complex supply chains, regulatory environments, and workforce challenges for remote and international construction projects.",
  },
  {
    icon: HardHat,
    title: "Construction Excellence",
    description: "Expert execution of luxury residential, resort development, and hospitality construction with uncompromising attention to detail.",
  },
  {
    icon: Sprout,
    title: "Value Engineering",
    description: "Strategic optimization of project budgets through innovative solutions while maintaining the highest quality standards.",
  },
];

export const Services = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="services"
      ref={elementRef as React.RefObject<HTMLElement>}
      className="relative py-24 lg:py-32 bg-[#0a0a0a]"
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className={`text-center mb-16 lg:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-inter text-xs tracking-[0.4em] text-gold uppercase mb-4">
            What I Do
          </p>
          <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-white font-light mb-6">
            Expert <span className="italic text-gold">Services</span>
          </h2>
          <p className="font-inter text-white/60 max-w-2xl mx-auto leading-relaxed">
            End-to-end expertise for residential and commercial projects of any scale or complexity.
          </p>
        </div>

        {/* Services Grid - 3 columns */}
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`group relative p-8 lg:p-10 bg-charcoal/50 border border-white/5 hover:border-gold/30 transition-all duration-500 ${
                  gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: gridVisible ? `${150 + index * 100}ms` : '0ms' }}
              >
                {/* Icon */}
                <div className="w-14 h-14 border border-gold/30 flex items-center justify-center mb-6 group-hover:bg-gold/10 group-hover:border-gold transition-all duration-300">
                  <Icon className="w-6 h-6 text-gold" />
                </div>

                {/* Title */}
                <h3 className="font-playfair text-xl lg:text-2xl text-white mb-4 group-hover:text-gold transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="font-inter text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                  {service.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-gold/20 group-hover:border-gold/50 transition-colors duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
