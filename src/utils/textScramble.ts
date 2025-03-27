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

export interface ScrambleOptions {
  steps?: number;
  interval?: number;
  initialText?: string;
  letterInterval?: number;
}

export interface ScrambleAnimation {
  stop: () => void;
}

export function scrambleText(
  element: Element,
  targetText: string,
  options: ScrambleOptions = {}
): ScrambleAnimation {
  const {
    steps = options.steps || 5,
    interval = options.interval || 150,
    initialText = options.initialText || "",
    letterInterval = options.letterInterval || 50,
  } = options;

  // Get all letter elements
  const letterElements = element.querySelectorAll(".scramble-letter");
  const targetChars = targetText.split("");

  // Track intervals for cleanup
  const intervals: number[] = [];

  // Animate each character independently
  letterElements.forEach((letterElement, charIndex) => {
    if (letterElement.classList.contains("scramble-space")) return; // Skip whitespace

    let currentStep = 0;
    const startDelay = charIndex * letterInterval;
    const targetChar = targetChars[charIndex];

    // Create the interval with proper typing
    let charInterval: number;

    const animateChar = () => {
      charInterval = window.setInterval(() => {
        if (currentStep >= steps) {
          letterElement.textContent = targetChar;
          clearInterval(charInterval);
          return;
        }

        // More dramatic character changes
        if (currentStep < steps - 1) {
          // Use a mix of random characters for more visual interest
          const randomIndex = Math.floor(Math.random() * randomChars.length);
          const newChar = randomChars[randomIndex];

          // Only update if the character would change
          if (letterElement.textContent !== newChar) {
            letterElement.textContent = newChar;
          }
        } else {
          letterElement.textContent = targetChar;
        }

        currentStep++;
      }, interval);

      intervals.push(charInterval);
    };

    // Start animation after delay
    setTimeout(animateChar, startDelay);
  });

  return {
    stop: () => intervals.forEach(clearInterval),
  };
}
