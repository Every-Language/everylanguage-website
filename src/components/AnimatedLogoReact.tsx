import { motion } from "motion/react";

export default function AnimatedLogoReact() {
  return (
    <motion.img
      animate={{
        // scale: [1, 2, 2, 1, 1.5],
        // scaleY: [1, 0, 0, 1, 1], // Squish vertically to half its height and back
        // rotate: [0, 0, 180, 180, 0],
        opacity: [0, 0.25, 0.5, 0.75, 1],
        borderRadius: ["50%", "50%", "50%", "50%", "50%"],

        backgroundColor: [
          //   "#d89e0f",
          "#c9322a",
          //   "#771311",
          //   "#490d0b",
          "#000000",
        ],
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: 0,
        repeatDelay: 1,
      }}
      style={circle}
      src="/logos/logo.svg"
      alt="Every Language Logo"
      width={200}
      height={200}
    />
  );
}

/**
 * ==============   Styles   ================
 */

const circle = {
  width: 150,
  height: 150,
  backgroundColor: "#000000",
  borderRadius: "50%",
};
