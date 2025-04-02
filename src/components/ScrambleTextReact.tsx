import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { motion, AnimatePresence } from "motion/react";

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

const CHARS = "!@#$%^&*():{};|,.<>/?";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;

export default function ScrambleTextReact({
  text: TARGET_TEXT,
  className = "",
  letterClass = "",
  steps = 5,
  interval = 150,
  letterInterval = 50,
  initialText = "",
  monospace = false,
}: ScrambleTextReactProps) {
  const [isVisible, setIsVisible] = useState(false);
  //   const [scrambledText, setScrambledText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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

  const [text, setText] = useState(TARGET_TEXT);

  const scramble = () => {
    console.log("scramble called");
    let pos = 0;

    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }

          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          const randomChar = CHARS[randomCharIndex];

          return randomChar;
        })
        .join("");

      //   console.log({ scrambled });

      setText(scrambled);
      pos++;

      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);

    setText(TARGET_TEXT);
  };

  //   const scramble = () => {
  //     let pos = 0;

  //     intervalRef.current = setInterval(() => {
  //       const scrambled = text
  //         .split("")
  //         .map((char, index) => {
  //           if (pos / CYCLES_PER_LETTER > index) {
  //             return char;
  //           }

  //           const randomCharIndex = Math.floor(Math.random() * CHARS.length);
  //           const randomChar = CHARS[randomCharIndex];

  //           return randomChar;
  //         })
  //         .join("");

  //       setScrambledText(scrambled);
  //       pos++;

  //       if (pos >= text.length * CYCLES_PER_LETTER) {
  //         stopScramble();
  //       }
  //     }, SHUFFLE_TIME);
  //   };

  //   const stopScramble = () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //     setScrambledText(text);
  //   };

  // Handle scramble animation
  useEffect(() => {
    if (!isVisible) {
      scramble();
    } else {
      stopScramble();
    }
    // console.log({ isVisible, text });
    return () => {
      stopScramble();
    };
  }, [isVisible, text]);

  useEffect(() => {
    scramble();
  }, []);

  const renderText = () => {
    if (monospace) {
      return text.split("").map((char, index) => (
        <motion.span
          key={index}
          className={`scramble-letter ${letterClass} ${
            char === " " ? "scramble-space" : ""
          }`}
          style={{
            display: "inline-block",
            width: "1ch",
            marginRight: monospace ? "0.5ch" : "0",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          {char}
        </motion.span>
      ));
    }
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        {text}
      </motion.span>
    );
  };

  return (
    <div ref={elementRef} className={className} data-scramble-text>
      <AnimatePresence>{renderText()}</AnimatePresence>
    </div>
  );
}
