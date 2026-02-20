import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineHeroProps {
    scene?: string;
    className?: string;
}

/**
 * SplineHero component for technical/architectural 3D background elements.
 * Adds a premium, interactive 3D feel to the section.
 */
export const SplineHero: React.FC<SplineHeroProps> = ({
    // Placeholder elegant architectural scene
    scene = "https://prod.spline.design/6Wq1Q7YGyWf8Z92N/scene.splinecode",
    className = ""
}) => {
    return (
        <div className={`absolute inset-0 z-10 pointer-events-none opacity-40 mix-blend-screen overflow-hidden ${className}`}>
            <Suspense fallback={<div className="w-full h-full bg-charcoal/10 animate-pulse" />}>
                <div className="w-full h-full transform scale-125 lg:scale-110">
                    <Spline
                        scene={scene}
                        className="w-full h-full"
                    />
                </div>
            </Suspense>
        </div>
    );
};
