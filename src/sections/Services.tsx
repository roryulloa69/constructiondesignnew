import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Building2, Home, Landmark, Trees, ShieldCheck, Ruler } from "lucide-react";

interface ServiceProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: string;
}

const ServiceCard = ({ icon, title, description, delay }: ServiceProps) => (
    <div className={`relative p-10 bg-white/[0.02] border border-white/[0.05] hover:border-gold/30 transition-all duration-700 group overflow-hidden ${delay} fill-mode-both`}>
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/0 group-hover:border-gold/40 transition-all duration-700" />

        <div className="mb-8 text-gold group-hover:scale-110 transition-transform duration-700 origin-left">
            {icon}
        </div>
        <h3 className="font-playfair text-2xl text-white mb-5 font-light tracking-wide">{title}</h3>
        <p className="font-inter text-sm text-white/40 leading-relaxed font-light group-hover:text-white/60 transition-colors duration-500">{description}</p>

        {/* Subtle number indicator */}
        <div className="absolute bottom-8 right-8 font-playfair text-4xl text-white/[0.02] group-hover:text-gold/[0.05] transition-colors duration-700">
            0{parseInt(delay.replace('delay-', '')) / 100}
        </div>
    </div>
);

export const Services = () => {
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

    return (
        <section
            id="services"
            ref={elementRef as React.RefObject<HTMLElement>}
            className="relative py-32 lg:py-48 bg-charcoal overflow-hidden"
        >
            {/* Background atmosphere */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(197,165,114,0.03),transparent_50%)]" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="max-w-3xl mb-24">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-px bg-gold/50" />
                        <p className="font-inter text-[10px] tracking-[0.5em] text-gold uppercase">Core Expertise</p>
                    </div>
                    <h2 className="font-playfair text-5xl lg:text-6xl text-white font-light leading-[1.2]">
                        Comprehensive Construction <span className="italic text-gold">Solutions</span>
                    </h2>
                    <p className="mt-8 text-white/40 font-inter text-lg font-light leading-relaxed">
                        Strategic oversight for complex projects that demand both aesthetic vision and technical precision.
                    </p>
                </div>

                <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05] border border-white/[0.05] ${isVisible ? "animate-in fade-in slide-in-from-bottom-12 duration-1000" : "opacity-0"
                    }`}>
                    <ServiceCard
                        icon={<Building2 size={36} strokeWidth={1} />}
                        title="Structural Design-Build"
                        description="End-to-end management of complex structural developments, from initial architectural integration to final structural execution."
                        delay="delay-100"
                    />
                    <ServiceCard
                        icon={<Home size={36} strokeWidth={1} />}
                        title="Premium Residential"
                        description="Specialized in high-end mountain ranches and coastal estates, delivering boutique quality at an institutional scale."
                        delay="delay-200"
                    />
                    <ServiceCard
                        icon={<Landmark size={36} strokeWidth={1} />}
                        title="Institutional Portfolios"
                        description="Strategic oversight of large-scale commercial and mixed-use portfolios exceeding $500M in valuation."
                        delay="delay-300"
                    />
                    <ServiceCard
                        icon={<Trees size={36} strokeWidth={1} />}
                        title="Exterior & Landscape"
                        description="Integrated civil works and sophisticated landscape design that bridges the gap between structure and site."
                        delay="delay-400"
                    />
                    <ServiceCard
                        icon={<ShieldCheck size={36} strokeWidth={1} />}
                        title="Global Logistics"
                        description="Native fluency and 37+ years experience navigating international logistics for offshore and remote locations."
                        delay="delay-500"
                    />
                    <ServiceCard
                        icon={<Ruler size={36} strokeWidth={1} />}
                        title="Project Recovery"
                        description="Technical assessment and turnaround management for stalled or under-performing multimillion-dollar developments."
                        delay="delay-600"
                    />
                </div>
            </div>
        </section>
    );
};
