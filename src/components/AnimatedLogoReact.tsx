import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const straightLine = `
  M 0 50
  Q 25 50, 50 50
  Q 75 50, 100 50
  Q 125 50, 150 50
  Q 175 50, 200 50
  Q 225 50, 250 50
  Q 275 50, 300 50
`;

const waveformPath = `
  M 0 50
  Q 25 20, 50 50
  Q 75 80, 100 50
  Q 125 20, 150 50
  Q 175 80, 200 50
  Q 225 20, 250 50
  Q 275 80, 300 50
`;

export default function WaveformAnimation() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Animate once on mount
    setAnimate(true);
  }, []);

  return (
    <div className="p-4 flex flex-col items-center">
      <svg width="300" height="100" viewBox="0 0 300 100">
        <motion.path
          initial={{ d: straightLine }}
          animate={{ d: animate ? waveformPath : straightLine }}
          fill="transparent"
          stroke="black"
          strokeWidth="2"
          transition={{
            duration: 1.2,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}
