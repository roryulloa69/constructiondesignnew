import React from "react";
import { PullQuote } from "@/components/PullQuote";
import { DecorativeSeparator } from "@/components/DecorativeSeparator";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
    {
        quote: "Michael's unique combination of architectural vision and construction expertise delivered our $125M island estate on time and within budget. His attention to detail and ability to navigate complex international logistics was exceptional.",
        author: "Private Client, Bahamas Development"
    },
    {
        quote: "Working with Michael on The Clubs at Houston Oaks was a masterclass in project management. His ±2% budget accuracy and proactive communication kept our $67MM investment on track throughout every phase.",
        author: "Development Partner, Houston Oaks"
    },
    {
        quote: "Michael's bilingual capabilities and international experience were invaluable for our resort development. He seamlessly coordinated teams across multiple countries while maintaining the highest quality standards.",
        author: "Resort Developer, Bakers Bay"
    }
];

export const Testimonials: React.FC = () => {
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

    return (
        <section
            ref={elementRef as React.RefObject<HTMLElement>}
            className="py-24 lg:py-32 bg-white"
        >
            <div className="container mx-auto max-w-7xl px-4 lg:px-8">
                {/* Section Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <span className="font-playfair text-8xl lg:text-[10rem] text-gold/10 font-light leading-none block -mb-6 lg:-mb-12">
                        04
                    </span>
                    <p className="font-inter text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">Client Testimonials</p>
                    <h2 className="font-playfair text-3xl lg:text-4xl text-foreground">What Clients Say</h2>
                </div>

                {/* Testimonials */}
                <div className="space-y-12 lg:space-y-16">
                    {testimonials.map((testimonial, idx) => (
                        <div
                            key={idx}
                            className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}
                            style={{ transitionDelay: isVisible ? `${300 + idx * 200}ms` : '0ms' }}
                        >
                            <PullQuote
                                quote={testimonial.quote}
                                author={testimonial.author}
                            />
                            {idx < testimonials.length - 1 && <DecorativeSeparator />}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
