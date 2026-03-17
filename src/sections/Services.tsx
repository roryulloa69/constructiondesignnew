import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Building2, Home, Landmark, Trees, ShieldCheck, Ruler } from "lucide-react";

interface ServiceProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    index: number;
}

const ServiceCard = ({ icon, title, description, index }: ServiceProps) => (
    <div
        className="relative p-10 lg:p-12 bg-white/[0.02] border border-white/[0.04] hover:border-gold/20 transition-all duration-700 group overflow-hidden"
        style={{ animationDelay: `${index * 100}ms` }}
    >
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-gold/0 group-hover:border-gold/30 transition-all duration-700" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-gold/0 group-hover:border-gold/30 transition-all duration-700" />

        <div className="mb-8 text-gold/70 group-hover:text-gold transition-colors duration-700">
            {icon}
        </div>
        <h3 className="font-playfair text-xl lg:text-2xl text-white mb-5 font-light tracking-wide">{title}</h3>
        <p className="font-inter text-sm text-white/35 leading-[1.8] font-light group-hover:text-white/55 transition-colors duration-700">{description}</p>
    </div>
);

export const Services = () => {
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

    const services = [
        { icon: <Building2 size={32} strokeWidth={1} />, title: "Structural Design-Build", description: "End-to-end management of complex structural developments, from initial architectural integration to final structural execution." },
        { icon: <Home size={32} strokeWidth={1} />, title: "Premium Residential", description: "Specialized in high-end mountain ranches and coastal estates, delivering boutique quality at an institutional scale." },
        { icon: <Landmark size={32} strokeWidth={1} />, title: "Institutional Portfolios", description: "Strategic oversight of large-scale commercial and mixed-use portfolios exceeding $500M in valuation." },
        { icon: <Trees size={32} strokeWidth={1} />, title: "Exterior & Landscape", description: "Integrated civil works and sophisticated landscape design that bridges the gap between structure and site." },
        { icon: <ShieldCheck size={32} strokeWidth={1} />, title: "Global Logistics", description: "Native fluency and 37+ years experience navigating international logistics for offshore and remote locations." },
        { icon: <Ruler size={32} strokeWidth={1} />, title: "Project Recovery", description: "Technical assessment and turnaround management for stalled or under-performing multimillion-dollar developments." },
    ];

    return (
        <section
            id="services"
            ref={elementRef as React.RefObject<HTMLElement>}
            className="relative py-32 lg:py-48 bg-charcoal overflow-hidden"
        >
            {/* Background atmosphere */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(197,165,114,0.03),transparent_50%)]" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="max-w-3xl mb-20 lg:mb-28">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-px bg-gold/50" />
                        <p className="font-inter text-[10px] tracking-[0.5em] text-gold/80 uppercase">Core Expertise</p>
                    </div>
                    <h2 className="font-playfair text-5xl lg:text-6xl text-white font-extralight leading-[1.15]">
                        Comprehensive Construction <span className="italic text-gold">Solutions</span>
                    </h2>
                    <p className="mt-8 text-white/35 font-inter text-lg font-light leading-relaxed">
                        Strategic oversight for complex projects that demand both aesthetic vision and technical precision.
                    </p>
                </div>

                <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/[0.04] ${isVisible ? "animate-in fade-in slide-in-from-bottom-10 duration-1000" : "opacity-0"
                    }`}>
                    {services.map((service, index) => (
                        <ServiceCard key={service.title} index={index} {...service} />
                    ))}
                </div>
            </div>
        </section>
    );
};
