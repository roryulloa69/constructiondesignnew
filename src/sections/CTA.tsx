import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const CTA = () => {
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

    return (
        <section
            ref={elementRef as React.RefObject<HTMLElement>}
            className="py-32 lg:py-56 bg-charcoal text-white relative overflow-hidden"
        >
            {/* Dynamic background lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(197,165,114,0.08),transparent_70%)] pointer-events-none" />

            {/* Decorative vertical lines */}
            <div className="absolute inset-0 flex justify-between px-12 opacity-5 pointer-events-none">
                <div className="w-px h-full bg-white" />
                <div className="w-px h-full bg-white hidden sm:block" />
                <div className="w-px h-full bg-white hidden lg:block" />
                <div className="w-px h-full bg-white" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <div
                    className={`max-w-4xl mx-auto transition-all duration-1000 ease-out fill-mode-both ${isVisible ? "animate-in fade-in slide-in-from-bottom-12" : "opacity-0"
                        }`}
                >
                    <div className="flex justify-center mb-10 overflow-hidden">
                        <p className="font-inter text-[10px] tracking-[0.5em] text-gold uppercase animate-in fade-in zoom-in duration-700 delay-300 fill-mode-both">
                            The Path To Excellence
                        </p>
                    </div>

                    <h2 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-light mb-12 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 fill-mode-both">
                        Ready to <span className="italic text-gold underline underline-offset-[12px] decoration-gold/20">Elevate</span> Your Next Development?
                    </h2>

                    <p className="font-inter text-xl text-white/40 mb-16 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both">
                        Put 37+ years of strategic construction expertise to work on your multimillion-dollar project.
                        Experience the synergy of vision and technical precision.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000 fill-mode-both">
                        <Button
                            asChild
                            className="h-20 px-16 bg-gold hover:bg-gold/90 text-charcoal rounded-none uppercase text-xs tracking-[0.3em] font-inter group transition-all duration-500"
                        >
                            <Link to="/contact">
                                Get in Touch
                                <ArrowRight className="ml-4 h-5 w-5 transition-transform group-hover:translate-x-2" />
                            </Link>
                        </Button>

                        <p className="text-white/20 font-inter text-[10px] tracking-widest uppercase sm:max-w-[120px] text-left">
                            Limited Availability For New Consultations
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
