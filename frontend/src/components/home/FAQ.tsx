"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "How are the products shipped safely?",
    a: "We use secure, triple-layered packaging for all items. Every shipment is fully insured and handled by trusted delivery partners to ensure your product arrives in perfect condition."
  },
  {
    q: "Can I request a custom size or specific material?",
    a: "Absolutely. Our master artisans can craft pieces in specific heights (from 6 inches to life-size) and materials including Temple Brass, Panchaloha Bronze, Pure Silver, and Krishna Shila Stone. Visit our 'Custom Commissions' page to start your custom order."
  },
  {
    q: "Do you provide authenticity certificates?",
    a: "Yes, every primary piece from Anand Arts comes with a signed Certificate of Authenticity, detailing the material composition, the artisan lineage, and the traditional techniques used in its creation."
  },
  {
    q: "What is the expected delivery time for commissions?",
    a: "For catalog items, delivery is typically within 7-10 business days. Custom orders usually take between 4 to 12 weeks depending on the complexity of the work."
  },
  {
    q: "How do I maintain and clean my temple art products?",
    a: "We recommend using a soft microfiber cloth for regular dusting. For brass and bronze, a traditional mix of tamarind and water or organic polish can be used once a year to keep them shining without damaging the fine detailing."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 relative overflow-hidden bg-[#1A1208]">
      {/* Background radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(184,134,11,0.08)_0%,_transparent_70%)] pointer-events-none" />
      
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Side: Branding/Title */}
        <div className="lg:w-1/3">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-[var(--color-brand-gold)]" />
            <span className="font-ui text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-brand-gold)]">Support & FAQ</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-brand-cream)] mb-8 leading-tight">
            Common <br/>
            <span className="italic font-light text-[var(--color-brand-gold-light)]">Inquiries</span>
          </h2>
          <p className="font-ui text-base text-[var(--color-brand-cream)]/60 leading-relaxed mb-10 max-w-sm">
            Everything you need to know about buying our handcrafted temple art for your home.
          </p>
          
          <div className="relative group p-8 rounded-3xl overflow-hidden">
            {/* Glassmorphism card for curator CTA */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 group-hover:bg-white/10 transition-all duration-500" />
            <div className="relative z-10">
              <p className="font-display text-2xl text-[var(--color-brand-cream)] mb-4">Still seeking?</p>
              <button className="flex items-center gap-3 text-[var(--color-brand-gold)] font-ui text-xs font-bold uppercase tracking-widest group-hover:gap-5 transition-all">
                CONTACT US <span className="text-xl">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Accordion */}
        <div className="lg:w-2/3">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`group transition-all duration-500 rounded-2xl border ${openIndex === idx ? 'bg-white/5 border-[var(--color-brand-gold)]/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left p-8"
                >
                  <span className={`font-display text-xl md:text-2xl lg:text-3xl transition-colors duration-300 ${openIndex === idx ? 'text-[var(--color-brand-gold-light)]' : 'text-[var(--color-brand-cream)] group-hover:text-[var(--color-brand-gold)]'}`}>
                    {faq.q}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === idx ? 'bg-[var(--color-brand-gold)] text-[var(--color-brand-char)] rotate-180' : 'bg-white/5 text-[var(--color-brand-gold)] group-hover:bg-white/10'}`}>
                    {openIndex === idx ? <Minus size={18} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "anticipate" }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8">
                        <div className="w-full h-[1px] bg-gradient-to-r from-[var(--color-brand-gold)]/30 to-transparent mb-6" />
                        <p className="font-ui text-base md:text-lg text-[var(--color-brand-cream)]/70 leading-relaxed max-w-3xl">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
      
      {/* Ornate bottom texture */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-brand-gold)]/20 to-transparent" />
    </section>
  );
}
