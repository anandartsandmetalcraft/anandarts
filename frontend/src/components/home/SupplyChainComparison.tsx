"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Factory, Store, Users, UserCheck, ShieldCheck, Flame, Heart } from "lucide-react";

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

            <div className="bg-[#16181D] rounded-[2rem] p-10 md:p-16 border border-[var(--color-brand-gold)]/30 relative overflow-hidden group">
               
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
                  
                  {/* From the Fire */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-2xl bg-[var(--color-brand-gold)] flex items-center justify-center text-white mb-6">
                      <Flame size={40} />
                    </div>
                    <h4 className="font-display text-xl text-white mb-2 uppercase tracking-wide">Anand Arts</h4>
                    <p className="font-ui text-[9px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)]">Original Manufacture</p>
                  </div>

                  {/* The Fast-Track Line */}
                  <div className="flex-1 flex items-center justify-center relative w-full h-[2px] md:h-[1px]">
                     {/* Horizontal Line (Desktop) */}
                     <div className="hidden md:block w-full h-[1px] bg-[var(--color-brand-gold)]/40" />
                     
                     {/* Vertical Line (Mobile) */}
                     <div className="md:hidden w-[1px] h-32 bg-[var(--color-brand-gold)]/40" />
                     
                     {/* Responsive Arrow */}
                     <div className="absolute md:right-[-12px] bottom-[-20px] md:bottom-auto">
                        <ArrowRight size={24} className="text-[var(--color-brand-gold)] rotate-90 md:rotate-0" />
                     </div>
                  </div>

                  {/* To the Heart */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-2xl bg-[#0F1115] border border-[var(--color-brand-gold)]/30 flex items-center justify-center text-white mb-6">
                      <Heart size={40} className="text-[var(--color-brand-gold)]" />
                    </div>
                    <h4 className="font-display text-xl text-white mb-2 uppercase tracking-wide">Your Home</h4>
                    <p className="font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375]">Artisan-Direct Pricing</p>
                  </div>

               </div>

               <div className="mt-16 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div className="flex gap-4">
                     <ShieldCheck className="text-[var(--color-brand-gold)] flex-shrink-0" size={18} />
                     <div>
                        <h5 className="font-ui text-[10px] font-bold uppercase tracking-widest text-white mb-2">Authenticity Verified</h5>
                        <p className="font-ui text-[11px] text-[#8B8375] leading-relaxed">Direct provenance ensures every gram of material is as promised.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <UserCheck className="text-[var(--color-brand-gold)] flex-shrink-0" size={18} />
                     <div>
                        <h5 className="font-ui text-[10px] font-bold uppercase tracking-widest text-white mb-2">Fair Value</h5>
                        <p className="font-ui text-[11px] text-[#8B8375] leading-relaxed">Artisans receive their true due, devotees pay the true price.</p>
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

