"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const FILTER_CARDS = [
  {
    title: "SCULPTURES FROM",
    value: "₹999",
    link: "/collections?minPrice=999",
    bg: "bg-[#8B2323]" // Heritage Red
  },
  {
    title: "SCULPTURES FROM",
    value: "₹2,999",
    link: "/collections?minPrice=2999",
    bg: "bg-[#8B2323]"
  },
  {
    title: "FLAT",
    value: "10% OFF",
    link: "/collections?discount=10",
    bg: "bg-[#8B2323]"
  },
  {
    title: "UP TO",
    value: "20% OFF",
    link: "/collections?discount=10",
    bg: "bg-[#8B2323]"
  },
];

export default function PriceFilters() {
  return (
    <section className="py-12 bg-[var(--color-brand-cream)] px-6 md:px-12 overflow-hidden">
      <div className="max-w-[1320px] mx-auto overflow-x-auto no-scrollbar pb-4">
        <div className="flex gap-6 overflow-x-auto no-scrollbar md:grid md:grid-cols-4 md:min-w-0">
          {FILTER_CARDS.map((card, idx) => (
            <Link key={idx} href={card.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative group cursor-pointer w-64 md:w-full aspect-square"
              >
                {/* Heritage "Stamp" Envelope Aesthetic */}
                <div className="absolute inset-0 bg-[#E8E1D5] rounded-3xl" />

                <div className="absolute inset-6 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-[1.02]">
                  {/* Scalloped / Stamp Border Effect */}
                  <div
                    className={`${card.bg} absolute inset-0`}
                    style={{
                      maskImage: 'radial-gradient(circle, transparent 70%, black 72%)',
                      maskSize: '20px 20px',
                      maskPosition: '-10px -10px'
                    }}
                  />

                  {/* Main Content Area with Jagged Edge Mask (Simulated) */}
                  <div className={`${card.bg} absolute inset-1 flex flex-col items-center justify-center text-center p-6 border-4 border-dashed border-white/20`}>
                    <span className="font-ui text-[12px] md:text-[14px] font-bold uppercase tracking-[0.3em] text-white/70 mb-2">
                      {card.title}
                    </span>
                    <div className="font-display text-4xl md:text-5xl text-white uppercase tracking-tight">
                      {card.value}
                    </div>

                    {/* Wax Seal Detail */}
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[var(--color-brand-gold)] rounded-full flex items-center justify-center shadow-lg border-4 border-[#8B2323] rotate-12 group-hover:rotate-0 transition-transform duration-700 overflow-hidden p-3">
                      <Image 
                        src="/Logo.png" 
                        alt="Anand Arts Logo" 
                        width={40} 
                        height={40} 
                        className="object-contain brightness-0 opacity-40" 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
