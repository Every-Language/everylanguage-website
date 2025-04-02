import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@uidotdev/usehooks";

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

const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;

export const randomChars =
  // latin
  // 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' +
  // accented
  // 'ÀÁÂÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÙÚÛÜßàáâäçèéêëìíîïñòóôö÷ùúûüýþÿ' +
  // mandarin
  "一二三四五六七八九十" +
  // arabic
  "ابتثجحخدذرزسشصضطظعغفقكلمنهوي" +
  // hindi
  "अइउएओकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह०१२३४५६७८९";

const ScrambleTextReact: React.FC<ScrambleTextReactProps> = ({
  text: TARGET_TEXT,
  className,
  letterClass,
  steps,
  interval,
  letterInterval,
  initialText,
  monospace,
}) => {
  const [refCallback, entry] = useIntersectionObserver({
    threshold: 0.1,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!!entry?.isIntersecting);
  }, [entry?.isIntersecting]);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      refCallback(elementRef.current);
    }
  }, [refCallback]);

  const intervalRef = useRef(null);

  const [text, setText] = useState(TARGET_TEXT);

  const scramble = () => {
    let pos = 0;
    // @ts-ignore: ignore type error
    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }

          const randomCharIndex = Math.floor(
            Math.random() * randomChars.length
          );
          const randomChar = randomChars[randomCharIndex];

          return randomChar;
        })
        .join("");

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

  useEffect(() => {
    if (isVisible) {
      scramble();
    } else {
      stopScramble();
    }
  }, [isVisible]);

  return <motion.span ref={elementRef}>{text}</motion.span>;
};

export default ScrambleTextReact;
