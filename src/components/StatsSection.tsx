import React from "react";
import { useCountUp } from "@/hooks/useCountUp";

export const StatsSection: React.FC = () => {
    const portfolio = useCountUp({ end: 500, duration: 2500, prefix: "$", suffix: "M+" });
    const years = useCountUp({ end: 37, duration: 2000, suffix: "+" });
    const states = useCountUp({ end: 12, duration: 1800 });
    const countries = useCountUp({ end: 4, duration: 1500 });
    const budgetAccuracy = useCountUp({ end: 2, duration: 1500, prefix: "±", suffix: "%" });
    const onTime = useCountUp({ end: 100, duration: 2000, suffix: "%" });

    return (
        <section className="py-16 lg:py-24 bg-foreground text-background">
            <div className="container mx-auto max-w-7xl px-4 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
                    <div ref={portfolio.elementRef} className="text-center">
                        <div className="font-playfair text-4xl lg:text-5xl text-gold mb-2">{portfolio.displayValue}</div>
                        <div className="font-inter text-xs lg:text-sm text-background/60 uppercase tracking-wider">Portfolio Managed</div>
                    </div>
                    <div ref={years.elementRef} className="text-center">
                        <div className="font-playfair text-4xl lg:text-5xl text-gold mb-2">{years.displayValue}</div>
                        <div className="font-inter text-xs lg:text-sm text-background/60 uppercase tracking-wider">Years Experience</div>
                    </div>
                    <div ref={states.elementRef} className="text-center">
                        <div className="font-playfair text-4xl lg:text-5xl text-gold mb-2">{states.displayValue}</div>
                        <div className="font-inter text-xs lg:text-sm text-background/60 uppercase tracking-wider">US States</div>
                    </div>
                    <div ref={countries.elementRef} className="text-center">
                        <div className="font-playfair text-4xl lg:text-5xl text-gold mb-2">{countries.displayValue}</div>
                        <div className="font-inter text-xs lg:text-sm text-background/60 uppercase tracking-wider">Countries</div>
                    </div>
                    <div ref={budgetAccuracy.elementRef} className="text-center">
                        <div className="font-playfair text-4xl lg:text-5xl text-gold mb-2">{budgetAccuracy.displayValue}</div>
                        <div className="font-inter text-xs lg:text-sm text-background/60 uppercase tracking-wider">Budget Accuracy</div>
                    </div>
                    <div ref={onTime.elementRef} className="text-center">
                        <div className="font-playfair text-4xl lg:text-5xl text-gold mb-2">{onTime.displayValue}</div>
                        <div className="font-inter text-xs lg:text-sm text-background/60 uppercase tracking-wider">On-Time Delivery</div>
                    </div>
                </div>
            </div>
        </section>
    );
};
