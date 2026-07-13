"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform, animate } from "framer-motion";

const STATS = [
  {
    prefix: "OVER",
    value: 50000,
    suffix: "+",
    label: "Masterpieces Delivered",
    sub: "To homes and temples globally"
  },
  {
    prefix: "SINCE 1990",
    value: 17,
    suffix: "+",
    label: "Years of Legacy",
    sub: "One and half decades of pure craftsmanship"
  },
  {
    prefix: "FOLLOWED BY",
    value: 20000,
    suffix: "+",
    label: "Artistic Devotees",
    sub: "Growing community on Social Media"
  },
];

interface DigitProps {
  digit: string;
  isVisible: boolean;
}

function seededDelay(index: number) {
  return (Math.abs(Math.sin(index * 3.1415 + 1.618)) % 1) * 0.2;
}

function DigitRoller({ digit, isVisible }: DigitProps) {
  const isNumber = !isNaN(parseInt(digit));
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (isVisible && isNumber) {
      setVal(parseInt(digit));
    }
  }, [isVisible, digit, isNumber]);

  if (!isNumber) return <span>{digit}</span>;

  return (
    <div className="h-[1.1em] overflow-hidden inline-block leading-none">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: `-${val * 10}%` }}
        transition={{ duration: 2.2, ease: [0.34, 1.56, 0.64, 1], delay: seededDelay(parseInt(digit) + 1) }}
        className="flex flex-col text-center"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="h-full block">{n}</span>
        ))}
      </motion.div>
    </div>
  );
}

function NumberTicker({ value, isVisible }: { value: number; isVisible: boolean }) {
  const digits = value.toLocaleString("en-IN").split("");

  return (
    <div className="flex tabular-nums">
      {digits.map((d, i) => (
        <DigitRoller key={i} digit={d} isVisible={isVisible} />
      ))}
    </div>
  );
}

export default function TrustCounter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-[var(--color-brand-cream-dark)]/50 overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <span className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-brand-gold)] block mb-4">Reassuring Excellence</span>
          <h2 className="font-display text-3xl md:text-4xl text-[var(--color-brand-char)] uppercase tracking-tight">
            For building trust and providing reassurance.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="flex flex-col items-center group"
            >
              <span className="font-ui text-[9px] font-bold uppercase tracking-[0.2em] text-[#8B8375] mb-4">
                {stat.prefix}
              </span>

              <div className="font-display text-5xl md:text-7xl text-[var(--color-brand-char)] mb-4 flex items-center h-[1.2em]">
                <NumberTicker value={stat.value} isVisible={isInView} />
                <span className="text-[var(--color-brand-gold)] ml-1 flex-shrink-0">{stat.suffix}</span>
              </div>

              <div className="space-y-1">
                <h4 className="font-ui text-sm font-bold uppercase tracking-widest text-[var(--color-brand-char)]">
                  {stat.label}
                </h4>
                <p className="font-script italic text-base text-[#8B8375]">
                  {stat.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
          viewport={{ once: true }}
          className="mt-20 pt-12 border-t border-black/5 flex flex-wrap justify-center items-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
        >
          {/* Artisan Badges */}
          <div className="flex items-center gap-2">
            <span className="font-ui text-[10px] font-bold uppercase tracking-widest">Vedic Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-ui text-[10px] font-bold uppercase tracking-widest">Years of Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-ui text-[10px] font-bold uppercase tracking-widest">Artisan Support</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
