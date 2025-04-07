import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const straightLine = `
  M 0 50 L 300 50
`;

const waveformPath1 = `
  M 0 50
  L 10 45 L 20 60 L 30 40 L 40 55 L 50 35
  L 60 65 L 70 25 L 80 70 L 90 30 L 100 60
  L 110 40 L 120 55 L 130 35 L 140 65 L 150 45
  L 160 55 L 170 30 L 180 65 L 190 40 L 200 60
  L 210 35 L 220 70 L 230 25 L 240 65 L 250 35
  L 260 55 L 270 40 L 280 60 L 290 45 L 300 50
`;

const waveformPath2 = `
  M 0 50
  L 10 40 L 20 65 L 30 35 L 40 60 L 50 30
  L 60 70 L 70 20 L 80 75 L 90 25 L 100 65
  L 110 35 L 120 60 L 130 30 L 140 70 L 150 40
  L 160 60 L 170 25 L 180 70 L 190 35 L 200 65
  L 210 30 L 220 75 L 230 20 L 240 70 L 250 30
  L 260 60 L 270 35 L 280 65 L 290 40 L 300 50
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
        {/* Background lines for waveform effect */}
        <g className="opacity-20">
          {[15, 25, 35, 65, 75, 85].map((y, i) => (
            <line
              key={i}
              x1="0"
              y1={y}
              x2="300"
              y2={y}
              stroke="#666"
              strokeWidth="1"
            />
          ))}
        </g>

        {/* Main waveform */}
        <motion.path
          initial={{ d: straightLine }}
          animate={{
            d: animate
              ? [waveformPath1, waveformPath2, waveformPath1]
              : straightLine,
          }}
          fill="transparent"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          transition={{
            d: {
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            },
          }}
        />
      </svg>
    </div>
  );
}
