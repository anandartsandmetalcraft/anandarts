"use client";
import React from "react";
import { motion } from "framer-motion";
import { Scale, ArrowLeft, Banknote, RefreshCcw, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] pt-32 pb-24">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <header className="mb-16">
          <Link 
            href="/legal" 
            className="flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] hover:text-[var(--color-brand-char)] transition-colors mb-12 group relative w-fit"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Legal Foundations
            <span className="absolute -bottom-1 left-6 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
          </Link>
          
          <div className="flex items-center gap-4 font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-brand-gold)] mb-6">
             <Scale size={16} /> 
             Financial Safeguards
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-[var(--color-brand-char)] uppercase tracking-tight leading-tight mb-8">
             Refund <br/> <span className="text-[#8B8375]">Policy</span>
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
                  As a policy, we do not offer Refund on products which are delivered in perfect condition as per the order placed. However, if the product is wrongfully delivered (product doesn't match the item in the order confirmation) or has a genuine quality/manufacturing defect or damaged during shipping, we are open to extending Return or Exchange for your order.
                </p>
                <div className="p-8 bg-blue-50 border border-blue-100 rounded-3xl mb-10">
                   <p className="text-blue-800 italic text-sm leading-relaxed m-0">
                     <strong>Unavailability Resolution:</strong> In case of unavailability of the same product, Anand Arts and Metal Craft will proceed for full Refund. Refund will be processed to your original method of payment.
                   </p>
                </div>
                <div className="p-8 bg-green-50 border border-green-100 rounded-3xl">
                   <p className="text-green-800 italic text-sm leading-relaxed m-0">
                     <strong>Transit Accountability:</strong> In the rare scenario that any product gets damaged during transit, we take full accountability for the damage, so that you can sit back, relax without any fear of shipping damage and shop!
                   </p>
                </div>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-8">Eligibility for Refund</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-[var(--color-brand-char)] text-xs uppercase tracking-widest">Handmade Variations</h4>
                    <p className="text-xs text-[#8B8375] leading-relaxed">
                      Handmade & Handpainted products may have minute imperfections in terms of color shades, texture, painting, polish, finish, shape, weight, size and also, insignificantly different from each other which make them unique & special. Refund will not be applicable in such scenario.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-[var(--color-brand-char)] text-xs uppercase tracking-widest">Natural Materials</h4>
                    <p className="text-xs text-[#8B8375] leading-relaxed">
                      Wooden products may develop hairline cracks with change of temperature & climate and with time. This is a natural process. Refund will not be applicable in such scenario.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-[var(--color-brand-char)] text-xs uppercase tracking-widest">Antiques Collections</h4>
                    <p className="text-xs text-[#8B8375] leading-relaxed">
                      Antiques Collections are not machine made or machine finished or newly manufactured. There may be multiple imperfections, damage, dent, color blemishes etc. Refund will not be applicable in such scenario.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-[var(--color-brand-char)] text-xs uppercase tracking-widest">Visual Representation</h4>
                    <p className="text-xs text-[#8B8375] leading-relaxed">
                      Handmade or Handpainted or Handcrafted or Vintage or Antique products will not be exactly similar to each other. The photograph will not be exact representation of the product, you receive, but of course similar. Refund will not be applicable for such differences.
                    </p>
                  </div>
                </div>

                <ul className="mt-12 space-y-4 border-l-2 border-[var(--color-brand-gold)]/20 pl-8">
                  <li className="text-sm text-[#4A453E]">Any dispute must be reported within <strong>3 Business Days</strong> from delivery.</li>
                  <li className="text-sm text-[#4A453E]">Refund is applicable only on products returned in <strong>original condition</strong>, unused, and unwashed.</li>
                  <li className="text-sm text-[#4A453E]">Original packaging and all tags must be intact.</li>
                  <li className="text-sm text-[#4A453E]">Address errors or refusal to accept delivery after 3 attempts will void the refund policy.</li>
                  <li className="text-sm text-[#4A453E]">For International orders, refusal to pay mandated customs duty will void the refund policy.</li>
                </ul>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-10">Process to Refund</h2>
                
                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-brand-char)] text-white flex items-center justify-center shrink-0 font-display italic">!</div>
                    <div className="flex-1">
                      <h4 className="font-bold uppercase tracking-widest text-sm mb-4">Initial Report</h4>
                      <p className="text-sm text-[#4A453E] leading-relaxed mb-6">
                        Always record the <strong>un-boxing video</strong> and photographs. If incorrect or damaged items are found, contact Anand Arts and Metal Craft Customer Care within <strong>48 hours</strong> from delivery.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="p-6 bg-[var(--color-brand-cream)] rounded-3xl">
                            <Mail size={16} className="text-[var(--color-brand-gold)] mb-2" />
                            <p className="text-xs font-bold uppercase mb-1">Email</p>
                            <p className="text-[11px] text-[#8B8375]">anandartsandmetalcraft@gmail.com</p>
                         </div>
                         <div className="p-6 bg-[var(--color-brand-cream)] rounded-3xl">
                            <Phone size={16} className="text-[var(--color-brand-gold)] mb-2" />
                            <p className="text-xs font-bold uppercase mb-1">WhatsApp</p>
                            <p className="text-[11px] text-[#8B8375]">+91 87542 62271</p>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-brand-char)] text-white flex items-center justify-center shrink-0 font-display">2</div>
                    <div className="flex-1">
                      <h4 className="font-bold uppercase tracking-widest text-sm mb-4">Review & Solution</h4>
                      <p className="text-sm text-[#4A453E] leading-relaxed mb-4">
                        Our team will review your concern and revert within <strong>7 Business Days</strong>. 
                      </p>
                      <p className="text-xs text-[#8B8375] italic">
                        Note: Return or Exchange will always be the first solution offered. Refund is processed only if the same product is unavailable.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-brand-char)] text-white flex items-center justify-center shrink-0 font-display">3</div>
                    <div className="flex-1">
                      <h4 className="font-bold uppercase tracking-widest text-sm mb-4">Pickup & Verification</h4>
                      <p className="text-sm text-[#4A453E]">A Reverse Pick Up will be arranged. Once the product is received in original condition and passes our Quality Check (QC), we will initiate the Refund to your original payment method. <strong>Please note: Forward and Reverse shipping charges will be deducted from the final refund amount</strong> unless the return is due to a confirmed manufacturing defect or transit damage.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-16 p-8 border border-[var(--color-brand-gold)]/20 rounded-[32px] text-center">
                   <p className="font-display text-xl text-[var(--color-brand-char)] uppercase tracking-widest mb-2">Refund Timeline</p>
                   <p className="text-sm text-[#8B8375]">It usually takes <strong>15 Business Days</strong> to complete the refund process from the day of reporting.</p>
                   <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8B8375] mt-8 opacity-40">Disclaimer: All policies are subject to change without prior notice.</p>
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
