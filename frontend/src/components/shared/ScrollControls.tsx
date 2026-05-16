"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ScrollControls() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const TridentIcon = ({ className }: { className?: string }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      {/* Ornate Trishula Path */}
      <path d="M11.25 2h1.5v4.5h-1.5zM11.25 10.5v11.5h1.5v-11.5h-1.5z" />
      <path d="M5.5 5.5c0 0 0 4.5 6 6.5s6-6.5 6-6.5C17.5 10 16 13 12 13s-5.5-3-5.5-7.5z" />
      <path d="M12 9.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z" />
    </svg>
  );

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-32 right-6 md:right-12 z-[40] group flex flex-col items-center"
          aria-label="Scroll to top"
        >
          {/* Flame/Glow effect behind */}
          <div className="absolute inset-0 bg-[var(--color-brand-gold)] blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
          
          <div className="relative w-14 h-14 bg-[var(--color-brand-char)]/90 backdrop-blur-md border border-[var(--color-brand-gold)]/40 rounded-full flex items-center justify-center text-[var(--color-brand-gold)] shadow-2xl transition-all duration-300 group-hover:border-[var(--color-brand-gold)] group-hover:-translate-y-2">
            <TridentIcon className="w-10 h-10 drop-shadow-[0_0_12px_rgba(184,134,11,0.8)]" />
          </div>
          
          <span className="font-ui text-[9px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)] mt-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
            Ascend
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
