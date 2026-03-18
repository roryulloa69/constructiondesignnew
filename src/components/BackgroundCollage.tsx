import { useEffect, useState } from "react";
import { projects } from "@/data/projects";

interface CollageImage {
  id: string;
  url: string;
  position: { top: string; left: string };
  size: { width: string; height: string };
  rotation: number;
  delay: number;
}

export const BackgroundCollage = () => {
  const [images, setImages] = useState<CollageImage[]>([]);

  useEffect(() => {
    // Collect all project images
    const allImages: string[] = [];
    projects.forEach((project) => {
      if (project.images && project.images.length > 0) {
        // Take up to 3 images from each project
        allImages.push(...project.images.slice(0, 3));
      }
    });

    // Shuffle images
    const shuffled = allImages.sort(() => Math.random() - 0.5);

    // Create 20-30 positioned images for the collage
    const collageCount = Math.min(25, shuffled.length);
    const collageImages: CollageImage[] = [];

    for (let i = 0; i < collageCount; i++) {
      collageImages.push({
        id: `collage-${i}`,
        url: shuffled[i % shuffled.length],
        position: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        },
        size: {
          width: `${150 + Math.random() * 150}px`, // 150-300px
          height: `${150 + Math.random() * 150}px`, // 150-300px
        },
        rotation: Math.random() * 30 - 15, // -15 to +15 degrees
        delay: Math.random() * 10, // 0-10 seconds delay for staggered animation
      });
    }

    setImages(collageImages);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dark overlay to keep images subtle */}
      <div className="absolute inset-0 bg-cream/95" />
      
      {/* Collage grid */}
      <div className="absolute inset-0">
        {images.map((img) => (
          <div
            key={img.id}
            className="absolute"
            style={{
              top: img.position.top,
              left: img.position.left,
              width: img.size.width,
              height: img.size.height,
              transform: `rotate(${img.rotation}deg) translate(-50%, -50%)`,
              animation: `twinkle 8s ease-in-out infinite`,
              animationDelay: `${img.delay}s`,
            }}
          >
            <img
              src={img.url}
              alt=""
              className="w-full h-full object-cover opacity-[0.08] grayscale"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.08;
            transform: rotate(${Math.random() * 30 - 15}deg) translate(-50%, -50%) scale(1);
          }
          25% {
            opacity: 0.15;
            transform: rotate(${Math.random() * 30 - 15}deg) translate(-50%, -50%) scale(1.05);
          }
          50% {
            opacity: 0.08;
            transform: rotate(${Math.random() * 30 - 15}deg) translate(-50%, -50%) scale(1);
          }
          75% {
            opacity: 0.12;
            transform: rotate(${Math.random() * 30 - 15}deg) translate(-50%, -50%) scale(1.02);
          }
        }
      `}</style>
    </div>
  );
};
