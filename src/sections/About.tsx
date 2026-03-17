import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import mikeProfile from "@/assets/michael-chandler.webp";

export const About = () => {
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

    return (
        <section
            id="about"
            ref={elementRef as React.RefObject<HTMLElement>}
            className="relative py-28 lg:py-44 bg-charcoal text-white overflow-hidden"
        >
            {/* Subtle radial accent */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_30%_20%,rgba(197,165,114,0.04),transparent_60%)] pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
                    {/* Left Column - Text Content */}
                    <div
                        className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                            }`}
                    >
                        {/* Section Tag */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-px bg-gold/60" />
                            <p className="font-inter text-[10px] tracking-[0.5em] text-gold/80 uppercase">
                                Legacy Since 1987
                            </p>
                        </div>

                        {/* Heading */}
                        <h2 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-extralight mb-10 leading-[1.05]">
                            A Unique{" "}
                            <span className="italic font-normal text-gold block sm:inline">Perspective</span>
                            <span className="block text-xl sm:text-2xl mt-5 text-white/30 font-inter font-light tracking-wide">On Strategic Execution.</span>
                        </h2>

                        {/* Content Body */}
                        <div className="space-y-7 text-white/60 font-inter text-[15px] leading-[1.85] max-w-xl">
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

                            {/* Quote */}
                            <div className="pt-8 border-t border-white/[0.06]">
                                <div className="flex items-start gap-5">
                                    <div className="w-1 h-14 bg-gradient-to-b from-gold/50 to-gold/0 mt-1 flex-shrink-0" />
                                    <p className="text-sm italic text-white/40 leading-relaxed">
                                        "Native-level fluency in Spanish enables seamless communication with international stakeholders
                                        across portfolios exceeding $500M in 4 countries."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile */}
                    <div
                        className={`relative transition-all duration-1000 delay-300 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                            }`}
                    >
                        <div className="relative group">
                            {/* Decorative Frame */}
                            <div className="absolute -top-8 -right-8 w-40 h-40 border-t border-r border-gold/15 transition-all duration-700 group-hover:border-gold/30" />
                            <div className="absolute -bottom-8 -left-8 w-40 h-40 border-b border-l border-gold/15 transition-all duration-700 group-hover:border-gold/30" />

                            {/* Main Image */}
                            <div className="relative overflow-hidden shadow-2xl">
                                <img
                                    src={mikeProfile}
                                    alt="Michael Chandler - Master Builder"
                                    className="w-full aspect-[4/5] object-cover grayscale-[15%] transition-all duration-[2000ms] group-hover:scale-[1.03] group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                            </div>

                            {/* Float Card */}
                            <div className="absolute -bottom-12 -right-4 sm:right-8 w-full max-w-[280px] bg-charcoal/90 backdrop-blur-2xl border border-white/[0.08] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                                <h3 className="font-playfair text-2xl text-white font-light mb-2">Michael Chandler</h3>
                                <p className="font-inter text-[10px] tracking-[0.3em] text-gold uppercase">
                                    Strategic Executive
                                </p>
                                <div className="mt-6 w-14 h-px bg-gradient-to-r from-gold/60 to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
