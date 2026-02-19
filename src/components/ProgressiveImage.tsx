import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import logo from "@/assets/mc-logo.png";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

/**
 * Progressive image component with blur-up loading effect.
 * Creates a tiny placeholder that blurs up to the full image.
 */
export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className,
  placeholderClassName,
  onLoad,
  onError,
  objectFit = "cover",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [thumbDataUrl, setThumbDataUrl] = useState<string | null>(null);

  // Generate a tiny thumbnail for blur-up effect
  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        // Create tiny canvas for thumbnail (20px wide)
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const thumbWidth = 20;
        const aspectRatio = img.height / img.width;
        const thumbHeight = Math.round(thumbWidth * aspectRatio);

        canvas.width = thumbWidth;
        canvas.height = thumbHeight;

        ctx.drawImage(img, 0, 0, thumbWidth, thumbHeight);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
        setThumbDataUrl(dataUrl);
      } catch (e) {
        // CORS or other error - just skip thumbnail
        console.warn("Could not generate thumbnail:", e);
      }
    };

    img.src = src;
  }, [src]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  if (hasError) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center bg-gradient-to-br from-cream via-offWhite to-stone/10",
        className
      )}>
        <img
          src={logo}
          alt="MC Design"
          className="w-16 h-16 object-contain opacity-30 mb-2"
        />
        <span className="text-xs text-charcoal/40 font-inter uppercase tracking-wider">
          Image Unavailable
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Blur-up placeholder */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-out",
          isLoaded ? "opacity-0" : "opacity-100",
          placeholderClassName
        )}
      >
        {thumbDataUrl ? (
          <img
            src={thumbDataUrl}
            alt=""
            className={cn("w-full h-full blur-xl scale-110", isLoaded ? "opacity-0" : "opacity-100")}
            style={{ objectFit }}
            aria-hidden="true"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone/20 via-cream to-gold/10 animate-pulse" />
        )}
      </div>

      {/* Full resolution image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full transition-all duration-700 ease-out",
          isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-sm scale-105"
        )}
        style={{ objectFit }}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

ProgressiveImage.displayName = "ProgressiveImage";
