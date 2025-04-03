import * as motion from "motion/react-client";

export default function Keyframes() {
  return (
    <motion.img
      animate={{
        scale: [1, 2, 2, 1, 1.5],
        // rotate: [0, 0, 180, 180, 0],
        borderRadius: ["50%"],
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: 0,
        repeatDelay: 1,
      }}
      style={box}
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

const box = {
  width: 100,
  height: 100,
  backgroundColor: "#000000",
  borderRadius: 5,
};
