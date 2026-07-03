"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Factory, Home, Store, Users, UserCheck, ShieldCheck } from "lucide-react";

export default function SupplyChainComparison() {
  return (
    <section className="py-32 bg-[#0F1115] text-[var(--color-brand-cream)] overflow-hidden relative">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl mb-24">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="font-ui text-[11px] font-bold uppercase tracking-[0.6em] text-[var(--color-brand-gold)] mb-6"
          >
            Efficiency by Design
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-7xl text-[#E8E1D5] mb-8 leading-tight"
          >
            The Direct <span className="italic font-light">Artisan</span> Line
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="font-ui text-lg text-[#8B8375] leading-relaxed"
          >
            Standard retail is a chain of compromises. At Anand Arts, we’ve collapsed the distance between the furnace and your sacred space.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          
          {/* THE TRADITIONAL CLIMB */}
          <div className="relative">
            <div className="flex items-center gap-4 mb-12">
               <div className="h-[1px] w-12 bg-slate-800" />
               <span className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">The Traditional Overhead</span>
            </div>

            <div className="space-y-4 relative">
               {/* Vertical Connection Line */}
               <div className="absolute left-[31px] top-8 bottom-8 w-[1px] bg-slate-800" />

               <TraditionalStep icon={<Factory size={20} />} label="Manufacturer" price="+ ₹0" />
               <TraditionalStep icon={<Store size={20} />} label="Dealer & Agents" price="+ 15% Markup" dim />
               <TraditionalStep icon={<Store size={20} />} label="Regional Retailer" price="+ 25% Markup" dim />
               <TraditionalStep icon={<Users size={20} />} label="You (Customer)" price="Final Inflated Price" highlight />
            </div>

            <div className="mt-12 pl-16">
              <p className="font-script text-xl text-slate-600 italic leading-relaxed">
                Middleman markups account for up to <span className="text-slate-400">40% of the cost</span> without adding a single gram of purity.
              </p>
            </div>
          </div>

          {/* THE ANAND ARTS FAST-TRACK */}
          <div className="relative">
             <div className="flex items-center gap-4 mb-12 lg:justify-end">
               <span className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-brand-gold)] text-right">The Anand Arts Direct Line</span>
               <div className="h-[1px] w-12 bg-[var(--color-brand-gold)]/40" />
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-brand-gold)]/25 bg-[#16181D] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:p-8 md:p-12">
               <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-brand-gold)]/60 to-transparent" />
               <div className="absolute right-0 top-0 h-56 w-56 translate-x-1/3 -translate-y-1/3 rounded-full bg-[var(--color-brand-gold)]/8 blur-3xl" />

               <div className="relative z-10">
                  <div className="flex flex-col gap-5 border-b border-white/8 pb-7 sm:flex-row sm:items-center sm:justify-between">
                     <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white p-2 shadow-2xl sm:h-20 sm:w-20">
                           <Image src="/Logo3.png" alt="Anand Arts logo" width={64} height={64} className="h-full w-full object-contain" />
                        </div>
                        <div>
                           <p className="font-ui text-[9px] font-bold uppercase tracking-[0.28em] text-[var(--color-brand-gold)]">Source</p>
                           <h4 className="mt-1 font-display text-2xl text-white">Anand Arts</h4>
                           <p className="mt-1 font-ui text-[11px] font-bold uppercase tracking-[0.18em] text-[#8B8375]">Original manufacturer</p>
                        </div>
                     </div>

                     <div className="hidden h-px flex-1 bg-gradient-to-r from-[var(--color-brand-gold)]/45 to-transparent sm:block" />

                     <div className="flex items-center gap-4 sm:text-right">
                        <div className="order-2 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-brand-gold)]/25 bg-[#0F1115] text-[var(--color-brand-gold)] sm:order-1">
                           <Home size={25} strokeWidth={1.6} />
                        </div>
                        <div className="order-1 sm:order-2">
                           <p className="font-ui text-[9px] font-bold uppercase tracking-[0.28em] text-[var(--color-brand-gold)]">Destination</p>
                           <h4 className="mt-1 font-display text-2xl text-white">Your Home</h4>
                           <p className="mt-1 font-ui text-[11px] font-bold uppercase tracking-[0.18em] text-[#8B8375]">Artisan-direct pricing</p>
                        </div>
                     </div>
                  </div>

                  <div className="grid gap-5 py-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
                     <div className="rounded-3xl bg-white/[0.04] p-5">
                        <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-gold)]">What changes</p>
                        <p className="mt-3 font-body text-sm leading-relaxed text-[#B8B0A3]">
                           No dealer chain. No repeated handling. The piece moves from our craft team to your sacred space with clearer provenance.
                        </p>
                     </div>

                     <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] md:rotate-0">
                        <ArrowRight size={20} />
                     </div>

                     <div className="rounded-3xl bg-white/[0.04] p-5">
                        <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-gold)]">What you receive</p>
                        <p className="mt-3 font-body text-sm leading-relaxed text-[#B8B0A3]">
                           Authentic material, fair value, and direct support from people who understand the work before it reaches you.
                        </p>
                     </div>
                  </div>

                  <div className="grid gap-4 border-t border-white/8 pt-7 sm:grid-cols-2">
                     <div className="flex gap-4">
                        <ShieldCheck className="mt-0.5 shrink-0 text-[var(--color-brand-gold)]" size={18} />
                        <div>
                           <h5 className="mb-2 font-ui text-[10px] font-bold uppercase tracking-widest text-white">Authenticity Verified</h5>
                           <p className="font-ui text-[11px] leading-relaxed text-[#8B8375]">Direct provenance keeps material, finish, and craftsmanship easier to verify.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <UserCheck className="mt-0.5 shrink-0 text-[var(--color-brand-gold)]" size={18} />
                        <div>
                           <h5 className="mb-2 font-ui text-[10px] font-bold uppercase tracking-widest text-white">Fair Value</h5>
                           <p className="font-ui text-[11px] leading-relaxed text-[#8B8375]">Artisans receive their true due while buyers avoid unnecessary markup.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="mt-12 text-center lg:text-right">
               <p className="font-display text-3xl text-[#E8E1D5]">
                 Bypass the markup. <br />
                 <span className="italic text-[var(--color-brand-gold)] font-light">Embrace the masterpiece.</span>
               </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TraditionalStep({ icon, label, price, dim = false, highlight = false }: any) {
  return (
    <div className={`flex items-center gap-6 p-4 rounded-2xl transition-all duration-500 group ${highlight ? 'bg-white/5 scale-105 shadow-xl border border-white/5' : ''}`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all ${
        highlight 
          ? 'bg-white text-[#0F1115] border-transparent' 
          : 'bg-[#1A1C20] text-slate-500 border-white/5 group-hover:border-slate-600'
      } relative z-10`}>
        {icon}
      </div>
      <div className="flex-1 flex items-center justify-between">
        <div>
           <h4 className={`font-ui text-[11px] font-bold uppercase tracking-widest mb-1 ${highlight ? 'text-white' : 'text-slate-400'}`}>
            {label}
          </h4>
          <p className="font-script text-sm text-slate-600 italic">Middleman node</p>
        </div>
        <span className={`font-ui text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${highlight ? 'bg-white/10 text-white' : 'text-slate-600'}`}>
          {price}
        </span>
      </div>
    </div>
  );
}
