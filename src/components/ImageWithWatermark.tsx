import { ReactNode } from "react";

// Text-based watermark component
const WatermarkLogo = () => (
  <span className="font-playfair text-2xl font-semibold tracking-tight opacity-[0.08] select-none text-charcoal">
    MC
  </span>
);

interface ImageWithWatermarkProps {
  children: ReactNode;
}

export const ImageWithWatermark = ({ children }: ImageWithWatermarkProps) => {
  return (
    <div className="relative w-full h-full">
      {children}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-8 p-8 -rotate-[30deg] scale-150"
        >
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              <WatermarkLogo />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
