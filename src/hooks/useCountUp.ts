import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
    end: number;
    duration?: number;
    decimals?: number;
    suffix?: string;
    prefix?: string;
}

export const useCountUp = ({
    end,
    duration = 2000,
    decimals = 0,
    suffix = "",
    prefix = ""
}: UseCountUpOptions) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.3 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;

        const startTime = Date.now();
        const endTime = startTime + duration;

        const updateCount = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = end * easeOutQuart;

            setCount(currentCount);

            if (now < endTime) {
                requestAnimationFrame(updateCount);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(updateCount);
    }, [hasStarted, end, duration]);

    const displayValue = `${prefix}${count.toFixed(decimals)}${suffix}`;

    return { count, displayValue, elementRef };
};
