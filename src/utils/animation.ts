/**
 * Animation utility to provide API compatibility for migrating from GSAP
 * to Motion One and other open-source animation libraries.
 */

import { animate, timeline, spring, stagger, type AnimationOptionsWithOverrides } from 'motion';
import LocomotiveScroll from 'locomotive-scroll';
import Splitting from 'splitting';
import Vivus from 'vivus';
import * as svgjs from 'svg.js';

// Initialize Locomotive Scroll
let locomotiveScroll: any = null;

/**
 * Initialize the locomotive scroll
 */
const initLocomotiveScroll = (options = {}) => {
    if (!locomotiveScroll) {
        locomotiveScroll = new LocomotiveScroll({
            smooth: true,
            ...options
        });
    }
    return locomotiveScroll;
};

// Type for split text options
interface SplitTextOptions {
    type?: string;
    [key: string]: any;
}

// Type for draw SVG options
interface DrawSVGOptions {
    duration?: number;
    [key: string]: any;
}

/**
 * Animation utilities for replacing GSAP
 */
export const animation = {
    /**
     * Animate an element, similar to gsap.to
     */
    animate: (elements: string | Element | Element[],
        properties: Record<string, any>,
        options?: AnimationOptionsWithOverrides) => {
        return animate(elements, properties, options);
    },

    /**
     * Create a timeline, similar to gsap.timeline
     */
    timeline: (animations: any[], options?: any) => {
        return timeline(animations, options);
    },

    /**
     * Set properties on elements, similar to gsap.set
     */
    set: (elements: string | Element | Element[], properties: Record<string, any>) => {
        // For simple properties we can use style
        let elementsArray: Element[] = [];

        if (typeof elements === 'string') {
            elementsArray = Array.from(document.querySelectorAll(elements));
        } else if (Array.isArray(elements)) {
            elementsArray = elements;
        } else if (elements instanceof NodeList) {
            // Filter to include only Elements
            elementsArray = Array.from(elements).filter((node): node is Element => node instanceof Element);
        } else {
            elementsArray = [elements];
        }

        elementsArray.forEach((element: Element) => {
            Object.entries(properties).forEach(([key, value]) => {
                // Handle transform properties separately
                if (['x', 'y', 'scale', 'scaleX', 'scaleY', 'rotate', 'rotateX', 'rotateY', 'skew', 'skewX', 'skewY'].includes(key)) {
                    // Apply transforms immediately using Motion One's animate with duration 0
                    animate(element, { [key]: value }, { duration: 0 });
                } else if (key === 'xPercent' || key === 'yPercent') {
                    // Handle percentage-based transforms
                    const prop = key === 'xPercent' ? 'translateX' : 'translateY';
                    (element as HTMLElement).style.transform = `${prop}(${value}%)`;
                } else if (key === 'drawSVG') {
                    // Handle drawSVG using Vivus (will be handled separately)
                } else {
                    // Handle standard CSS properties
                    (element as HTMLElement).style[key as any] = value;
                }
            });
        });

        return elementsArray;
    },

    /**
     * ScrollTrigger replacement using Locomotive Scroll and IntersectionObserver
     */
    scrollTrigger: (element: string | Element, callback: Function, options: any = {}) => {
        const scroll = initLocomotiveScroll();

        const targetElement = typeof element === 'string'
            ? document.querySelector(element)
            : element;

        if (!targetElement) return;

        const triggerElement = options.trigger
            ? (typeof options.trigger === 'string' ? document.querySelector(options.trigger) : options.trigger)
            : targetElement;

        if (!triggerElement) return;

        // Parse start and end positions
        const parseTriggerPosition = (position: string) => {
            if (!position) return 0;
            const [element, viewport] = position.split(' ');
            // Return a percentage value between 0 and 1
            return element === 'top' ? 0 : element === 'center' ? 0.5 : element === 'bottom' ? 1 : 0;
        };

        const startPos = parseTriggerPosition(options.start) || 0;
        const endPos = parseTriggerPosition(options.end) || 1;

        // Setup intersection observer for trigger
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];

            if (entry.isIntersecting) {
                // Calculate progress based on intersection ratio
                const progress = options.scrub ? entry.intersectionRatio : 1;

                // Call callback with progress
                callback(progress);

                // If not scrubbing, we can disconnect after triggering
                if (!options.scrub) {
                    observer.disconnect();
                }
            }
        }, {
            threshold: Array.from({ length: 101 }, (_, i) => i / 100), // Create thresholds for smooth progress
            rootMargin: '0px'
        });

        observer.observe(triggerElement);

        // Return cleanup function
        return () => observer.disconnect();
    },

    /**
     * Split text, similar to SplitText
     */
    splitText: (element: string | Element, options: SplitTextOptions = {}) => {
        return Splitting({
            target: element,
            by: options.type?.includes('chars') ? 'chars' :
                options.type?.includes('words') ? 'words' :
                    options.type?.includes('lines') ? 'lines' : 'chars',
            ...options
        });
    },

    /**
     * Draw SVG, similar to DrawSVGPlugin
     */
    drawSVG: (element: string | Element, options: DrawSVGOptions = {}) => {
        const targetElement = typeof element === 'string'
            ? document.querySelector(element)
            : element;

        if (!targetElement) return null;

        return new Vivus(targetElement as HTMLElement, {
            duration: options.duration || 200,
            type: 'sync',
            ...options
        });
    },

    /**
     * Utility functions similar to gsap.utils
     */
    utils: {
        toArray: (selector: string | Element | Element[] | NodeList) => {
            if (typeof selector === 'string') {
                return Array.from(document.querySelectorAll(selector));
            } else if (selector instanceof NodeList) {
                return Array.from(selector);
            }
            return Array.isArray(selector) ? selector : [selector];
        }
    }
};

// For svg.js compatibility
export const SVG = (element: string | Element): any => {
    return svgjs.SVG(element);
};

// Provide spring function for physics-based animations
export { spring };

// Export stagger utility
export { stagger };

// Export Motion, Locomotive Scroll, and Splitting for direct use if needed
export { animate, timeline };
export { initLocomotiveScroll };
export { Splitting };

export default animation; 