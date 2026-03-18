import { useEffect, useRef } from "react";

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Add random shimmer points to grid
    const shimmerPoints = Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 8,
    }));

    shimmerPoints.forEach((point, i) => {
      const shimmer = document.createElement("div");
      shimmer.className = "absolute w-1 h-1 rounded-full animate-shimmer-pulse";
      shimmer.style.left = `${point.x}%`;
      shimmer.style.top = `${point.y}%`;
      shimmer.style.animationDelay = `${point.delay}s`;
      canvasRef.current?.appendChild(shimmer);
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base dark background with subtle grid */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--gold) / 0.03) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--gold) / 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Architectural lines with breathing animation */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal lines */}
        <line
          x1="0%" y1="15%" x2="40%" y2="15%"
          stroke="hsl(var(--gold) / 0.2)"
          strokeWidth="1"
          filter="url(#glow)"
          className="animate-breathe-line"
          style={{ animationDelay: '0s' }}
        />
        <line
          x1="60%" y1="35%" x2="100%" y2="35%"
          stroke="hsl(var(--gold) / 0.15)"
          strokeWidth="1"
          filter="url(#glow)"
          className="animate-breathe-line"
          style={{ animationDelay: '1.5s' }}
        />
        <line
          x1="0%" y1="65%" x2="30%" y2="65%"
          stroke="hsl(var(--gold) / 0.18)"
          strokeWidth="1"
          filter="url(#glow)"
          className="animate-breathe-line"
          style={{ animationDelay: '3s' }}
        />
        <line
          x1="70%" y1="85%" x2="100%" y2="85%"
          stroke="hsl(var(--gold) / 0.2)"
          strokeWidth="1"
          filter="url(#glow)"
          className="animate-breathe-line"
          style={{ animationDelay: '4.5s' }}
        />

        {/* Vertical lines */}
        <line
          x1="25%" y1="0%" x2="25%" y2="50%"
          stroke="hsl(var(--gold) / 0.15)"
          strokeWidth="1"
          filter="url(#glow)"
          className="animate-breathe-line"
          style={{ animationDelay: '0.75s' }}
        />
        <line
          x1="45%" y1="20%" x2="45%" y2="80%"
          stroke="hsl(var(--gold) / 0.2)"
          strokeWidth="1"
          filter="url(#glow)"
          className="animate-breathe-line"
          style={{ animationDelay: '2.25s' }}
        />
        <line
          x1="75%" y1="10%" x2="75%" y2="60%"
          stroke="hsl(var(--gold) / 0.18)"
          strokeWidth="1"
          filter="url(#glow)"
          className="animate-breathe-line"
          style={{ animationDelay: '3.75s' }}
        />

        {/* Abstract architectural shapes */}
        <rect
          x="35%" y="40%" width="15%" height="8%"
          fill="none"
          stroke="hsl(var(--gold) / 0.12)"
          strokeWidth="1"
          filter="url(#glow)"
          className="animate-breathe-shape"
          style={{ animationDelay: '1s' }}
        />
        <rect
          x="55%" y="55%" width="20%" height="12%"
          fill="none"
          stroke="hsl(var(--gold) / 0.1)"
          strokeWidth="1"
          filter="url(#glow)"
          className="animate-breathe-shape"
          style={{ animationDelay: '2.5s' }}
        />
        <rect
          x="10%" y="25%" width="12%" height="15%"
          fill="none"
          stroke="hsl(var(--gold) / 0.14)"
          strokeWidth="1"
          filter="url(#glow)"
          className="animate-breathe-shape"
          style={{ animationDelay: '4s' }}
        />

        {/* Diagonal accent lines */}
        <line
          x1="40%" y1="20%" x2="60%" y2="40%"
          stroke="hsl(var(--gold) / 0.08)"
          strokeWidth="1"
          filter="url(#glow)"
          className="animate-breathe-line"
          style={{ animationDelay: '5s' }}
        />
        <line
          x1="20%" y1="70%" x2="35%" y2="85%"
          stroke="hsl(var(--gold) / 0.1)"
          strokeWidth="1"
          filter="url(#glow)"
          className="animate-breathe-line"
          style={{ animationDelay: '5.5s' }}
        />
      </svg>

      <style>{`
        @keyframes breathe-line {
          0%, 100% {
            opacity: 0.3;
            filter: drop-shadow(0 0 2px hsl(var(--gold) / 0.3));
          }
          50% {
            opacity: 0.7;
            filter: drop-shadow(0 0 8px hsl(var(--gold) / 0.6));
          }
        }

        @keyframes breathe-shape {
          0%, 100% {
            opacity: 0.2;
            filter: drop-shadow(0 0 3px hsl(var(--gold) / 0.2));
          }
          50% {
            opacity: 0.5;
            filter: drop-shadow(0 0 10px hsl(var(--gold) / 0.5));
          }
        }

        @keyframes shimmer-pulse {
          0%, 100% {
            opacity: 0;
            box-shadow: 0 0 0px hsl(var(--gold));
          }
          50% {
            opacity: 0.6;
            box-shadow: 0 0 8px hsl(var(--gold));
          }
        }

        .animate-breathe-line {
          animation: breathe-line 8s ease-in-out infinite;
        }

        .animate-breathe-shape {
          animation: breathe-shape 10s ease-in-out infinite;
        }

        .animate-shimmer-pulse {
          animation: shimmer-pulse 6s ease-in-out infinite;
          background: hsl(var(--gold) / 0.8);
        }
      `}</style>
    </div>
  );
};
