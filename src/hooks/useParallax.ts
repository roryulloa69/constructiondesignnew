import { useEffect, useState, useRef, useCallback } from 'react';

interface UseParallaxOptions {
  speed?: number; // 0.1 = slow, 1 = same as scroll
  direction?: 'up' | 'down';
}

export const useParallax = (options: UseParallaxOptions = {}) => {
  const { speed = 0.5, direction = 'up' } = options;
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLElement>(null);

  const handleScroll = useCallback(() => {
    if (!elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how far through the viewport the element is
    const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
    
    // Calculate parallax offset
    const parallaxOffset = (clampedProgress - 0.5) * 200 * speed;
    setOffset(direction === 'up' ? -parallaxOffset : parallaxOffset);
  }, [speed, direction]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { elementRef, offset };
};

// Hook for mouse-following parallax effect
export const useMouseParallax = (intensity: number = 0.02) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) * intensity;
      const y = (e.clientY - window.innerHeight / 2) * intensity;
      setPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return position;
};

// Hook for scroll-based opacity and scale
export const useScrollTransform = () => {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { scrollY, windowHeight };
};
