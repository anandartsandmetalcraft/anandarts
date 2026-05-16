"use client";
import React from "react";
import { motion } from "framer-motion";
import { RefreshCcw, ArrowLeft, ShieldCheck, Mail, Phone, MapPin, Camera } from "lucide-react";
import Link from "next/link";

export default function ReturnExchangePage() {
  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] pt-32 pb-24">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <header className="mb-16">
          <Link 
            href="/legal" 
            className="flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] hover:text-[var(--color-brand-gold)] transition-colors mb-12 group relative w-fit"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Legal Foundations
            <span className="absolute -bottom-1 left-6 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
          </Link>
          
          <div className="flex items-center gap-4 font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-brand-gold)] mb-6">
             <RefreshCcw size={16} /> 
             Service Commitment
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-[var(--color-brand-char)] uppercase tracking-tight leading-tight mb-8">
             Return & <br/> <span className="text-[#8B8375]">Exchange</span>
          </h1>
        </header>

        <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-xl border border-black/5">
          <article className="prose prose-stone max-w-none">
            <div className="space-y-12">
              <section>
                <p className="text-[#4A453E] leading-relaxed text-lg italic border-l-4 border-[var(--color-brand-gold)] pl-8 mb-10">
                  "<strong>Anand Arts and Metal Craft</strong> endeavors to ensure that every transaction at our website is seamless. We take great care in delivering our products and adhere to the highest quality standards."
                </p>
                <p className="text-[#4A453E] leading-relaxed mb-6">
                  As a policy, we do not offer Return or Exchange on products which are delivered in perfect condition as per the order placed. However, if the product is wrongfully delivered or has a genuine manufacturing defect, we are open to extending a Return or Exchange.
                </p>
                <div className="p-8 bg-green-50 border border-green-100 rounded-3xl">
                   <p className="text-green-800 italic text-sm leading-relaxed m-0">
                     <strong>Transit Damage:</strong> If any product gets damaged during transit, we take full accountability of the damage. You can shop with confidence knowing we've got you covered.
                   </p>
                </div>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-8">Eligibility for Return & Exchange</h2>
                <ul className="space-y-6 list-none p-0">
                  <li className="flex gap-4">
                    <span className="text-[var(--color-brand-gold)] font-display text-xl">•</span>
                    <p className="text-sm text-[#4A453E] m-0"><strong>Handmade Nature:</strong> Minute imperfections in color, texture, or finish are unique to artisanal products and are not eligible for returns.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-[var(--color-brand-gold)] font-display text-xl">•</span>
                    <p className="text-sm text-[#4A453E] m-0"><strong>Natural Aging:</strong> Hairline cracks in wooden products due to climate changes are natural and not considered defects.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-[var(--color-brand-gold)] font-display text-xl">•</span>
                    <p className="text-sm text-[#4A453E] m-0"><strong>Collections:</strong> Pieces that are not machine-made may have blemishes that contribute to their vintage appeal.</p>
                  </li>
                </ul>

                <div className="mt-12 p-8 bg-[var(--color-brand-cream)] rounded-3xl border border-black/5">
                   <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Quick Requirements</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#8B8375]">
                      <p>• Contact us within 3 business days of delivery.</p>
                      <p>• Provide an unboxing video and high-res photos.</p>
                      <p>• Item must be unused and in original packaging.</p>
                      <p>• Shipping address must be accurate and complete.</p>
                   </div>
                </div>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-10">Process to Return</h2>
                <div className="space-y-8">
                  <div className="flex gap-6 items-start">
                    <Camera className="text-[var(--color-brand-gold)] shrink-0" size={24} />
                    <p className="text-sm text-[#4A453E]">Record an unboxing video and take clear photos immediately upon delivery.</p>
                  </div>
                  <div className="flex gap-6 items-start">
                    <Mail className="text-[var(--color-brand-gold)] shrink-0" size={24} />
                    <p className="text-sm text-[#4A453E]">Email your concern to <strong>anandartsandmetalcraft@gmail.com</strong> with your order number and attachments.</p>
                  </div>
                  <div className="flex gap-6 items-start">
                    <RefreshCcw className="text-[var(--color-brand-gold)] shrink-0" size={24} />
                    <p className="text-sm text-[#4A453E]">Once approved, we will arrange a Reverse Pickup. If the same product is unavailable, a refund will be issued. <strong>Forward and Reverse shipping charges will be deducted</strong> from the refund amount unless the return is due to a transit damage or manufacturing defect.</p>
                  </div>
                </div>
              </section>

              <section className="mt-12 pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B8375]">Average Timeline: 15 Business Days</p>
                <div className="flex gap-6">
                  <Link href="/contact" className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)] hover:underline">Contact Support</Link>
                  <Link href="/legal/refund-policy" className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)] hover:underline">Refund Policy</Link>
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
