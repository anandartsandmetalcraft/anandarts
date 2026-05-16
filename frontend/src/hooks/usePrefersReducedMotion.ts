"use client";

import { useState, useEffect } from "react";

/**
 * Global Accessibility Hook: Reduced Motion
 * ────────────────────────────────────────────────────────────────
 * RULE F-7: Animations must respect prefers-reduced-motion.
 * This hook is used to disable transitions, parallax, and 
 * heavy motion for users with sensitivity or accessibility needs.
 * ────────────────────────────────────────────────────────────────
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return prefersReducedMotion;
}
