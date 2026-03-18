import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/mc-logo.png";
import heroVideo from "@/assets/hero-video.mp4";

interface VideoHeroProps {
  onOpenPortfolio: () => void;
}

export const VideoHero: React.FC<VideoHeroProps> = ({ onOpenPortfolio }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/80" />
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-charcoal/60" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-6 lg:px-12">
        {/* Logo */}
        <div className="mb-12 opacity-0 animate-fade-in">
          <img src={logo} alt="MC Logo" className="h-20 md:h-24 w-auto drop-shadow-2xl" />
        </div>

        {/* Main title */}
        <div className="text-center space-y-4 mb-8 opacity-0 animate-fade-in delay-200">
          <h1 className="font-playfair text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider text-cream drop-shadow-2xl">
            MICHAEL CHANDLER
          </h1>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-6 opacity-0 animate-fade-in delay-300">
          <div className="w-20 h-px bg-gold" />
          <div className="w-3 h-3 rotate-45 border-2 border-gold" />
          <div className="w-20 h-px bg-gold" />
        </div>

        {/* Subtitle */}
        <p className="font-inter text-cream text-xl md:text-2xl font-light tracking-[0.4em] uppercase mb-12 opacity-0 animate-fade-in delay-400 drop-shadow-lg">
          Fine Construction & Design
        </p>

        {/* CTA Button */}
        <div className="opacity-0 animate-fade-in delay-500">
          <Button
            onClick={onOpenPortfolio}
            size="lg"
            className="bg-gold hover:bg-gold/90 text-charcoal font-inter font-semibold px-10 py-7 text-lg tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold/30 rounded-sm"
          >
            View Portfolio
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in delay-700">
          <div className="w-6 h-10 border-2 border-cream/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2 bg-cream/50 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};
