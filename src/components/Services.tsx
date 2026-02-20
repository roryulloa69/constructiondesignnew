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
      className="relative py-20 lg:py-32 bg-foreground text-background"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`mb-16 lg:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <span className="font-playfair text-8xl lg:text-[10rem] text-gold/20 font-light leading-none block -mb-6 lg:-mb-12">
            03
          </span>
          <p className="font-inter text-xs tracking-[0.3em] text-background/60 uppercase mb-3">Services</p>
          <h2 className="font-playfair text-3xl lg:text-4xl text-background mb-4">What I Do</h2>
          <p className="font-inter text-background/70 max-w-xl">
            End-to-end expertise for residential and commercial projects of any scale or complexity.
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`group transition-all duration-700 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                style={{ transitionDelay: gridVisible ? `${200 + index * 100}ms` : '0ms' }}
              >
                <div className="border-l border-gold/30 pl-6 py-2 group-hover:border-gold transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-5 h-5 text-gold" />
                    <h3 className="font-playfair text-xl text-background">{service.title}</h3>
                  </div>
                  <p className="font-inter text-sm text-background/60 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
