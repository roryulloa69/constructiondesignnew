import Spline from '@splinetool/react-spline';
import { useState } from 'react';

export default function SplineScene() {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black text-white p-4 text-center">
                <div className="max-w-md">
                    <h3 className="text-xl font-bold mb-2 text-gold">3D Scene Unavailable</h3>
                    <p className="text-white/60">The 3D scene could not be loaded. This might be due to a connection issue or browser compatibility.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full relative">
            <iframe
                src="https://my.spline.design/6Wq1Q7YGyM-iab9i/"
                frameBorder="0"
                width="100%"
                height="100%"
                title="Spline 3D Scene"
                onError={() => setHasError(true)}
            />
        </div>
    );
}
