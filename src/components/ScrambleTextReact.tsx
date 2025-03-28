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
}

export default function ScrambleTextReact({
  text,
  className = "",
  letterClass = "",
  steps = 3,
  interval = 30,
  letterInterval = 10,
  initialText = "",
}: ScrambleTextReactProps) {
  const [isScrambled, setIsScrambled] = useState(true);
  const animationRef = useRef<{ stop: () => void } | null>(null);
  const elementRef = useRef<HTMLSpanElement | null>(null);

  const [ref, entry] = useIntersectionObserver({
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    rootMargin: "0px",
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const visibilityRatio = entry?.intersectionRatio ?? 0;

    if (visibilityRatio > 0.5 && isScrambled) {
      // Element is more than 50% visible, stop scrambling
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      setIsScrambled(false);
    } else if (visibilityRatio < 0.1 && !isScrambled) {
      // Element is less than 10% visible, start scrambling
      animationRef.current = scrambleText(element, text, {
        steps,
        interval,
        letterInterval,
        initialText,
      });
      setIsScrambled(true);
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [
    entry?.intersectionRatio,
    text,
    steps,
    interval,
    letterInterval,
    initialText,
    isScrambled,
  ]);

  const setRefs = (el: HTMLSpanElement | null) => {
    elementRef.current = el;
    ref(el);
  };

  return (
    <span
      ref={setRefs}
      className={`scramble-text ${className}`}
      data-text={text}
      data-steps={steps}
      data-interval={interval}
      data-initial-text={initialText}
      data-letter-interval={letterInterval}
    >
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={`scramble-letter ${letterClass} ${
            char === " " ? "scramble-space" : ""
          }`}
          data-char={char}
          data-index={index}
        >
          {!isScrambled
            ? char
            : char === " "
            ? " "
            : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[
                Math.floor(Math.random() * 52)
              ]}
        </span>
      ))}
    </span>
  );
}
