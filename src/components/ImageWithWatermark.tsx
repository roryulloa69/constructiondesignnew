import { ReactNode } from "react";
import logo from "@/assets/mc-logo.png";

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
              <img
                src={logo}
                alt=""
                className="w-24 h-24 object-contain opacity-[0.12] select-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
