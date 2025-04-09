import {
  animate,
  createScope,
  createSpring,
  createDraggable,
  Scope,
  svg,
} from "animejs";
import { useEffect, useRef, useState } from "react";
const squigglePath =
  "M2.15,28.48c4.2.04,6.84-.18,10.96.06,1.44.09,2.77,1.13,3.5,2.21,1.17,1.74,1.54,3.9,3.5,4.66,1.95.76,4.31.32,5.59-1.35.7-.92,4.01-7.34,5.83-11.97,2.21-5.64,8.19-3.51,8.72.74.59,4.77,3.38,16.08,4.5,18.59,1.36,3.05,5.26,2.47,6.41.19,1.61-3.18,4.17-12.71,6.03-19.95.5-1.95,2.87-16.18,3.57-18.07s3.39-1.92,4.13-.03c0,0,2.66,18.43,3.14,21.43.8,4.97,1.78,10.62,2.96,15.51.6,2.46,2.32,5.84,5.24,6.52,2.26.53,4.39-.96,5.41-3.13,1.89-4.03,4.62-17.77,4.92-19.58.6-3.67,6.35-3.98,7.47-.65.51,1.5,1.83,4.02,3.29,4.62,4.83,1.99,10.9,1.79,15.97.5";
const straightPath = "M2.15,2.15L127.43,2.15";

function App() {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<Scope | null>(null);
  const [rotations, setRotations] = useState(0);

  useEffect(() => {
    if (!root.current) return;

    scope.current = createScope({ root: root.current }).add((scope) => {
      // Every anime.js instances declared here are now scopped to <div ref={root}>

      // Created a bounce animation loop
      animate(".logo", {
        scale: [
          { to: 1.25, ease: "inOut(3)", duration: 200 },
          { to: 1, ease: createSpring({ stiffness: 300 }) },
        ],
        loop: true,
        loopDelay: 250,
      });

      // Make the logo draggable around its center
      createDraggable(".logo", {
        container: [0, 0, 0, 0],
        releaseEase: createSpring({ stiffness: 200 }),
      });

      // Register function methods to be used outside the useEffect
      scope.add("rotateLogo", (i) => {
        animate(straightPath, {
          points: svg.morphTo(squigglePath),
          ease: "inOutCirc",
          duration: 500,
          onComplete: () => console.log("hi there"),
        });
        svg.morphTo(straightPath);
      });
    });

    // Properly cleanup all anime.js instances declared inside the scope
    return () => scope.current?.revert();
  }, []);

  const handleClick = () => {
    const i = rotations + 1;
    setRotations(i);
    // Animate logo rotation on click using the method declared inside the scope
    scope.current?.methods.rotateLogo(i);
  };

  return (
    <div ref={root}>
      <div className="large centered row">
        <img
          src="/logos/logo-dark.svg"
          className="logo react"
          alt="React logo"
        />
      </div>
      <div className="medium row">
        <fieldset className="controls">
          <button onClick={handleClick}>rotations: {rotations}</button>
        </fieldset>
      </div>
    </div>
  );
}

export default App;
