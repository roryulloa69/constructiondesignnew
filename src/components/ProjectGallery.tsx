import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious, 
  type CarouselApi 
} from "@/components/ui/carousel";

interface ProjectImage {
  id: string;
  image_url: string;
  rotation_angle: number | null;
}

interface ProjectGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  images: ProjectImage[];
  initialIndex?: number;
}

export const ProjectGallery = ({
  open,
  onOpenChange,
  projectTitle,
  images,
  initialIndex = 0,
}: ProjectGalleryProps) => {
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [currentRotation, setCurrentRotation] = useState(images[initialIndex]?.rotation_angle || 0);

  useEffect(() => {
    if (!api) {
      return
    }
 
    setCurrentIndex(api.selectedScrollSnap())
 
    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap())
      setCurrentRotation(images[api.selectedScrollSnap()]?.rotation_angle || 0)
    })
  }, [api, images])

  useEffect(() => {
    if (api) {
      api.scrollTo(initialIndex, true)
    }
  }, [initialIndex, api])

  if (images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-playfair">{projectTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="relative flex-1 flex items-center justify-center p-6">
          <Carousel setApi={setApi} className="w-full h-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={image.image_url}
                      alt={`${projectTitle} - Image ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                      style={{ transform: `rotate(${image.rotation_angle || 0}deg)` }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background" />
          </Carousel>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto p-6 pt-0">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => api?.scrollTo(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-primary scale-105"
                    : "border-border opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={image.image_url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{ transform: `rotate(${image.rotation_angle || 0}deg)` }}
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
