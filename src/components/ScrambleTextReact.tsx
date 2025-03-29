import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { scrambleText } from "@/utils/textScramble";

interface ScrambleTextReactProps {
  text: string;
  className?: string;
  letterClass?: string;
  steps?: number;
  interval?: number;
  letterInterval?: number;
  initialText?: string;
  monospace?: boolean;
}

export default function ScrambleTextReact({
  text,
  className = "",
  letterClass = "",
  steps = 5,
  interval = 150,
  letterInterval = 50,
  initialText = "",
  monospace = false,
}: ScrambleTextReactProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrambleAnimation, setScrambleAnimation] = useState<{
    stop: () => void;
  } | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  // Set up intersection observer
  const [refCallback, entry] = useIntersectionObserver({
    threshold: 0.1,
  });

  // Update our ref with the intersection observer callback
  useEffect(() => {
    if (elementRef.current) {
      refCallback(elementRef.current);
    }
  }, [refCallback]);

  // Handle visibility changes
  useEffect(() => {
    setIsVisible(!!entry?.isIntersecting);
  }, [entry?.isIntersecting]);

  // Handle scramble animation
  useEffect(() => {
    if (!elementRef.current) return;

    // Stop any existing animation
    if (scrambleAnimation) {
      scrambleAnimation.stop();
    }

    // Start new animation if not visible
    if (!isVisible) {
      // Ensure the DOM has been updated with the letter elements
      requestAnimationFrame(() => {
        const animation = scrambleText(elementRef.current!, text, {
          steps,
          interval,
          letterInterval,
          initialText,
        });
        setScrambleAnimation(animation);
      });
    }

    // Cleanup animation when component unmounts
    return () => {
      if (scrambleAnimation) {
        scrambleAnimation.stop();
      }
    };
  }, [isVisible, text, steps, interval, letterInterval, initialText]);

  const renderText = () => {
    if (monospace) {
      return text.split("").map((char, index) => (
        <span
          key={index}
          className={`scramble-letter ${letterClass} ${
            char === " " ? "scramble-space" : ""
          }`}
          style={{
            display: "inline-block",
            width: "1ch",
            marginRight: monospace ? "0.5ch" : "0",
          }}
        >
          {char}
        </span>
      ));
    }
    return text;
  };

  return (
    <div ref={elementRef} className={className} data-scramble-text>
      {renderText()}
    </div>
  );
}
