import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import mikeProfile from "@/assets/michael-chandler.webp";

export const About = () => {
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

    return (
        <section
            id="about"
            ref={elementRef as React.RefObject<HTMLElement>}
            className="relative py-24 lg:py-40 bg-charcoal text-white overflow-hidden"
        >
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
                    {/* Left Column - Text Content */}
                    <div
                        className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                            }`}
                    >
                        {/* Section Tag */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-8 h-px bg-gold" />
                            <p className="font-inter text-xs tracking-[0.4em] text-gold uppercase">
                                Legacy Since 1987
                            </p>
                        </div>

                        {/* Heading with italic emphasis */}
                        <h2 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-light mb-10 leading-[1.1]">
                            A Unique{" "}
                            <span className="italic font-normal text-gold block sm:inline">Perspective</span>
                            <span className="block text-2xl sm:text-3xl mt-4 text-white/40 font-inter tracking-tight">On Strategic Execution.</span>
                        </h2>

                        {/* Content Body */}
                        <div className="space-y-8 text-white/70 font-inter text-lg leading-relaxed max-w-xl">
                            <p>
                                Michael Chandler is a Strategic Construction Leader with over 37 years of experience
                                steering multimillion-dollar developments from conception to handover. His expertise
                                lies in navigating the complex challenges of modern construction — labor shortages,
                                technological integration, and international logistics.
                            </p>
                            <p>
                                With decades of hands-on field experience, Michael possesses a rare ability to bridge
                                high-level architectural design with rigorous P&L stewardship and construction execution.
                                This dual expertise has made him the trusted advisor for clients who demand both aesthetic
                                excellence and fiscal precision.
                            </p>

                            {/* Specialized Detail */}
                            <div className="pt-8 border-t border-white/10">
                                <div className="flex items-start gap-4">
                                    <div className="w-1 h-12 bg-gold/30 mt-1" />
                                    <p className="text-base italic text-white/50">
                                        " Native-level fluency in Spanish enables seamless communication with international stakeholders
                                        across portfolios exceeding $500M in 4 countries."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Presentation */}
                    <div
                        className={`relative transition-all duration-1000 delay-300 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                            }`}
                    >
                        <div className="relative group">
                            {/* Decorative Frame Elements */}
                            <div className="absolute -top-6 -right-6 w-32 h-32 border-t-2 border-r-2 border-gold/20" />
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 border-b-2 border-l-2 border-gold/20" />

                            {/* Main Image with refined presentation */}
                            <div className="relative overflow-hidden shadow-2xl">
                                <img
                                    src={mikeProfile}
                                    alt="Michael Chandler - Master Builder"
                                    className="w-full aspect-[4/5] object-cover grayscale-[20%] transition-transform duration-[2000ms] group-hover:scale-105"
                                />
                                {/* Overlay gradient for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-60" />
                            </div>

                            {/* Float Card - Modern glassmorphism */}
                            <div className="absolute -bottom-10 -right-6 sm:right-12 w-full max-w-[280px] bg-charcoal/80 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
                                <h3 className="font-playfair text-2xl text-white mb-2">Michael Chandler</h3>
                                <p className="font-inter text-[10px] tracking-[0.25em] text-gold uppercase">
                                    Strategic Executive
                                </p>
                                <div className="mt-6 w-12 h-px bg-gold/50" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/[0.01] -skew-x-12 translate-x-1/2 pointer-events-none" />
        </section>
    );
};
