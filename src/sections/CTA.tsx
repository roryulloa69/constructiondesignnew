import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const CTA = () => {
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

    return (
        <section
            ref={elementRef as React.RefObject<HTMLElement>}
            className="py-36 lg:py-56 bg-charcoal text-white relative overflow-hidden"
        >
            {/* Radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(197,165,114,0.06),transparent_60%)] pointer-events-none" />

            {/* Vertical accent lines */}
            <div className="absolute inset-0 flex justify-between px-12 pointer-events-none">
                <div className="w-px h-full bg-white/[0.03]" />
                <div className="w-px h-full bg-white/[0.03] hidden sm:block" />
                <div className="w-px h-full bg-white/[0.03] hidden lg:block" />
                <div className="w-px h-full bg-white/[0.03]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <div
                    className={`max-w-4xl mx-auto transition-all duration-1000 ease-out fill-mode-both ${isVisible ? "animate-in fade-in slide-in-from-bottom-12" : "opacity-0"
                        }`}
                >
                    <div className="flex justify-center mb-10 overflow-hidden">
                        <p className="font-inter text-[10px] tracking-[0.5em] text-gold/70 uppercase animate-in fade-in zoom-in duration-700 delay-300 fill-mode-both">
                            The Path To Excellence
                        </p>
                    </div>

                    <h2 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-extralight mb-14 leading-[1.05] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 fill-mode-both">
                        Ready to <span className="italic text-gold">Elevate</span> Your Next Development?
                    </h2>

                    <p className="font-inter text-lg lg:text-xl text-white/35 mb-16 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both">
                        Put 37+ years of strategic construction expertise to work on your multimillion-dollar project.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000 fill-mode-both">
                        <Button
                            asChild
                            className="h-20 px-16 bg-gold hover:bg-gold-dark text-white rounded-none uppercase text-[10px] tracking-[0.35em] font-inter group transition-all duration-500 shadow-[0_0_60px_rgba(197,165,114,0.12)]"
                        >
                            <Link to="/contact">
                                Get in Touch
                                <ArrowRight className="ml-4 h-5 w-5 transition-transform group-hover:translate-x-2" />
                            </Link>
                        </Button>

                        <p className="text-white/20 font-inter text-[10px] tracking-widest uppercase sm:max-w-[140px] text-left leading-relaxed">
                            Limited Availability For New Consultations
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
