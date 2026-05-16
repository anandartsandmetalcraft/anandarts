"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Quote, Hammer, Award } from "lucide-react";

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

export default function HeritageBlogSection() {
  return (
    <section className="py-24 bg-[var(--color-brand-cream)] overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-brand-gold)] block mb-4"
            >
              The Chronicled Heritage
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-6xl text-[var(--color-brand-char)] leading-tight"
            >
              Three Decades of <br />
              <span className="italic font-light">Metal & Devotion</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[var(--color-brand-gold)]/10 shadow-xl"
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
              <InstagramIcon />
            </div>
            <div>
              <p className="font-display text-xl text-[var(--color-brand-char)] leading-none mb-1">20,000+</p>
              <p className="font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375]">Devoted Followers</p>
            </div>
          </motion.div>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left Column: The Story */}
          <div className="lg:col-span-7 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="prose prose-stone max-w-none"
            >
              <p className="font-display text-2xl text-[var(--color-brand-char)] leading-relaxed italic border-l-4 border-[var(--color-brand-gold)] pl-8 mb-12">
                "We don't just sell idols; we preserve the lineage of sacred metalcraft that has been part of our family for over 35 years."
              </p>

              <div className="space-y-8 font-ui text-lg text-[#8B8375] leading-relaxed">
                <p>
                  Established in 1990, Anand Arts began as a humble digital forge in Bengaluru with a singular vision: to bring temple-grade craftsmanship directly to the homes of devotees. While the industry moved towards mass-produced plastic and generic molds, we stayed true to the <strong>lost-wax casting process</strong> and hand-chiseled detailing.
                </p>
                <p>
                  For three decades, our furnace has never gone cold. Every piece you see on our platform—from the 6-inch miniature brass Krishna to the life-sized bronze Nataraja—is conceived, cast, and finished in our <strong>own manufacturing unit</strong>.
                </p>
                <p>
                  Today, we are humbled to be trusted by over 50,000 customers worldwide. Our digital community of 20,000+ followers isn't just a number; it's a testament to the revival of traditional art in the modern age.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
                <Hammer className="text-[var(--color-brand-gold)] mb-4" size={32} />
                <h4 className="font-display text-xl text-[var(--color-brand-char)] mb-2">Own Manufacturing</h4>
                <p className="font-ui text-sm text-[#8B8375]">Zero middlemen. Every piece is made in our workshop by master artisans.</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
                <Award className="text-[var(--color-brand-gold)] mb-4" size={32} />
                <h4 className="font-display text-xl text-[var(--color-brand-char)] mb-2">Quality Grade</h4>
                <p className="font-ui text-sm text-[#8B8375]">Using only 100% Temple-Grade Brass, Bronze, and Pure 925 Silver.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Imagery & Quote */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <Image
                src="/Divine_set.webp"
                alt="Artisan Crafting"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-char)] to-transparent opacity-60" />
              <div className="absolute bottom-12 left-12 right-12">
                <Quote className="text-[var(--color-brand-gold)] mb-4" size={40} />
                <p className="font-display text-2xl text-white leading-tight italic">
                  "Our hands shape the metal, but your devotion gives it life."
                </p>
              </div>
            </motion.div>

            <div className="bg-[var(--color-brand-gold)] text-white p-12 rounded-[3rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <h3 className="font-display text-3xl mb-4">Direct from Source</h3>
              <p className="font-ui text-sm opacity-90 leading-relaxed mb-6">
                By owning our manufacturing process, we bypass the dealer networks that usually hike prices by 40-60%. You get the artisan's price, and the artisan gets their due.
              </p>
              <div className="h-[2px] w-12 bg-white/30" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
