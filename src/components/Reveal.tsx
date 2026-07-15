"use client";

import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Scroll-reveal wrapper. Animates in when scrolled into view, but ALWAYS
 * falls back to visible (so content can never get stuck at opacity 0 if the
 * IntersectionObserver doesn't fire — headless renderers, no-JS, etc.).
 */
export function Reveal({ children, delay = 0, y = 22, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduce) {
      controls.set({ opacity: 1, y: 0 });
      return;
    }
    const el = ref.current;
    const reveal = () => {
      if (shown) return;
      setShown(true);
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } });
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && reveal()),
      { rootMargin: "-60px" }
    );
    if (el) io.observe(el);

    // Safety net: never leave content hidden.
    const fallback = setTimeout(reveal, 1400);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, delay, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
}
