'use client';

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface LoadingTextProps {
  text?: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export function LoadingText({
  text = " Loading",
  className,
  speed = 1000,
  delay = 0,
}: LoadingTextProps) {
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimating(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!isAnimating) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => [...prev, text[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setDisplayText([]);
          currentIndex = 0;
          setIsAnimating(true);
        }, speed);
      }
    }, speed / text.length);

    return () => clearInterval(interval);
  }, [isAnimating, text, speed]);

  return (
    <div className={cn("relative flex flex-col items-center justify-center gap-4", className)}>
      {/* Loading Circle */}
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />

      {/* Main text */}
      <div className="flex items-center justify-center">
        <div className="flex">
          {displayText.map((char, index) => (
            <span
              key={index}
              className={cn(
                "text-lg font-medium text-primary inline-block",
                "animate-[fall_0.5s_ease-out]",
                "origin-top"
              )}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {char}
            </span>
          ))}
          {displayText.length > 0 && (
            <>
              <span className="animate-pulse text-lg font-medium text-primary">.</span>
              <span className="animate-pulse delay-150 text-lg font-medium text-primary">.</span>
              <span className="animate-pulse delay-300 text-lg font-medium text-primary">.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 