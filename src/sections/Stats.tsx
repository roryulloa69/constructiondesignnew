import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface StatItemProps {
    value: string;
    label: string;
    index: number;
}

const StatItem = ({ value, label, index }: StatItemProps) => {
    return (
        <div
            className="text-center group"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <span className="block font-playfair text-4xl sm:text-5xl lg:text-6xl text-gold font-extralight mb-3 transition-all duration-500 group-hover:text-gold-light">
                {value}
            </span>
            <span className="font-inter text-[9px] sm:text-[10px] tracking-[0.35em] text-white/30 uppercase">
                {label}
            </span>
        </div>
    );
};

export const Stats = () => {
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

    const stats = [
        { value: "$500M+", label: "Portfolio Managed" },
        { value: "37+", label: "Years Experience" },
        { value: "12", label: "US States" },
        { value: "4", label: "Countries" },
        { value: "±2%", label: "Budget Accuracy" },
        { value: "100%", label: "On-Time Delivery" },
    ];

    return (
        <section
            ref={elementRef as React.RefObject<HTMLElement>}
            className="bg-charcoal py-20 lg:py-28 relative"
        >
            {/* Subtle top/bottom lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            <div className="container mx-auto px-6">
                <div
                    className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-14 gap-x-8 ${isVisible ? "animate-in fade-in slide-in-from-bottom-6 duration-1000" : "opacity-0"
                        }`}
                >
                    {stats.map((stat, index) => (
                        <StatItem key={index} index={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
};
