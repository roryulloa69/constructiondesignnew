import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface StatItemProps {
    value: string;
    label: string;
    delay: string;
}

const StatItem = ({ value, label, delay }: StatItemProps) => {
    return (
        <div className={`text-center transition-all duration-1000 ${delay} fill-mode-both`}>
            <span className="block font-playfair text-4xl sm:text-5xl lg:text-6xl text-gold font-light mb-3">
                {value}
            </span>
            <span className="font-inter text-[10px] sm:text-xs tracking-[0.3em] text-white/40 uppercase">
                {label}
            </span>
        </div>
    );
};

export const Stats = () => {
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

    const stats = [
        { value: "$500M+", label: "Portfolio Managed", delay: "delay-100" },
        { value: "37+", label: "Years Experience", delay: "delay-200" },
        { value: "12", label: "US States", delay: "delay-300" },
        { value: "4", label: "Countries", delay: "delay-400" },
        { value: "±2%", label: "Budget Accuracy", delay: "delay-500" },
        { value: "100%", label: "On-Time Delivery", delay: "delay-600" },
    ];

    return (
        <section
            ref={elementRef as React.RefObject<HTMLElement>}
            className="bg-charcoal py-24 border-y border-white/5"
        >
            <div className="container mx-auto px-6">
                <div
                    className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-16 gap-x-8 ${isVisible ? "animate-in fade-in slide-in-from-bottom-8 duration-1000" : "opacity-0"
                        }`}
                >
                    {stats.map((stat, index) => (
                        <StatItem key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
};
