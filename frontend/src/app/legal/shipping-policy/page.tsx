"use client";
import React from "react";
import { motion } from "framer-motion";
import { Truck, ArrowLeft, Info, Globe, ShieldCheck, Clock, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";

export default function ShippingPolicyPage() {
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
             <Truck size={16} /> 
             Logistics & Care
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-[var(--color-brand-char)] uppercase tracking-tight leading-tight mb-8">
             Shipping <br/> <span className="text-[#8B8375]">Policy</span>
          </h1>
        </header>

        <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-xl border border-black/5">
          <article className="prose prose-stone max-w-none">
            <div className="space-y-12">
              <section>
                <p className="text-[#4A453E] leading-relaxed text-lg italic border-l-4 border-[var(--color-brand-gold)] pl-8 mb-10">
                  "<strong>Anand Arts and Metal Craft</strong> endeavors to ensure that your every purchase is seamless and memorable with the highest standard of quality and shopping experience."
                </p>
                <p className="text-[#4A453E] leading-relaxed mb-6">
                  We have a strict Quality Checking process embedded before each product is packed and dispatched. We take utmost care in packing to ensure zero damage during transit – domestic or international and we ship through registered reputed shipping service providers.
                </p>
                <div className="p-8 bg-green-50 border border-green-100 rounded-3xl mb-8">
                   <p className="text-green-800 italic text-sm leading-relaxed m-0">
                     <strong>Transit Assurance:</strong> In the rare scenario that any product gets damaged during transit, we take full accountability for the damage, so that you can sit back, relax without any fear of shipping damage and shop!
                   </p>
                </div>
              </section>

              {/* Domestic Shipping */}
              <section className="border-t border-black/5 pt-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand-cream)] flex items-center justify-center text-[var(--color-brand-gold)]">
                    <MapPin size={20} />
                  </div>
                  <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] m-0">Domestic Shipping</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="p-8 bg-[var(--color-brand-cream)]/30 rounded-3xl border border-black/5">
                    <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Shipping Charges</h4>
                    <p className="text-sm text-[#4A453E] leading-relaxed">
                      We offer <strong>Free Shipping</strong> within India on minimum order value of <strong>Rs 2000 and above</strong>. For orders below Rs 2000, shipping charges will be visible at checkout.
                    </p>
                  </div>
                  <div className="p-8 bg-[var(--color-brand-cream)]/30 rounded-3xl border border-black/5">
                    <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Delivery Method</h4>
                    <p className="text-sm text-[#4A453E] leading-relaxed">
                      We use surface delivery to ensure the safety of our artifacts. Each consignment is <strong>fully insured</strong> against loss or damage during shipment.
                    </p>
                  </div>
                </div>

                <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm">
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock size={14} className="text-[var(--color-brand-gold)]" /> Timeline
                  </h4>
                  <p className="text-sm text-[#8B8375] leading-relaxed">
                    <strong>Dispatch:</strong> 2-3 Business Days from order date.<br/>
                    <strong>Delivery:</strong> 5-7 Business Days within India after dispatch.<br/>
                    <span className="text-[10px] italic mt-2 block opacity-70">* Timelines are indicative and may vary due to external factors.</span>
                  </p>
                </div>
              </section>

              {/* International Shipping */}
              <section className="border-t border-black/5 pt-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand-cream)] flex items-center justify-center text-[var(--color-brand-gold)]">
                    <Globe size={20} />
                  </div>
                  <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] m-0">International Shipping</h2>
                </div>

                <div className="space-y-8">
                  <div className="p-8 bg-[var(--color-brand-char)] text-white rounded-[32px]">
                    <h4 className="font-display text-lg uppercase tracking-widest mb-4">Global Logistics by DHL</h4>
                    <p className="text-sm text-[#8B8375] leading-relaxed mb-6">
                      International shipping charges are calculated at actuals quoted by <strong>DHL Worldwide</strong> based on volumetric weight, actual weight, and destination.
                    </p>
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <Clock size={14} className="text-[var(--color-brand-gold)]" />
                        </div>
                        <span className="text-xs uppercase font-bold tracking-widest">5-7 Days Delivery</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <ShieldCheck size={14} className="text-[var(--color-brand-gold)]" />
                        </div>
                        <span className="text-xs uppercase font-bold tracking-widest">Global Tracking</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 border border-black/5 rounded-3xl bg-amber-50/30">
                      <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Important Note</h4>
                      <p className="text-xs text-[#8B8375] leading-relaxed">
                        International shipping is <strong>NOT FREE</strong>. Even if the website shows free shipping for high-value orders, these charges are calculated separately after order placement. Please contact us for an estimate before ordering.
                      </p>
                    </div>
                    <div className="p-8 border border-black/5 rounded-3xl bg-amber-50/30">
                      <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Duties & Taxes</h4>
                      <p className="text-xs text-[#8B8375] leading-relaxed">
                        Duties and taxes are <strong>not included</strong> in your order. Most countries charge duties at port entry. These must be paid directly to the shipping company upon delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* General Terms */}
              <section className="border-t border-black/5 pt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="font-display text-xl uppercase tracking-widest text-[var(--color-brand-char)] mb-4">Delivery Attempts</h4>
                    <p className="text-sm text-[#8B8375] leading-relaxed">
                      Our shipping partners will attempt delivery <strong>3 times</strong> before returning the order. Please ensure your shipping address and mobile number are accurate to prevent delays.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-display text-xl uppercase tracking-widest text-[var(--color-brand-char)] mb-4 flex items-center gap-2">
                      <CreditCard size={18} /> Payments
                    </h4>
                    <p className="text-sm text-[#8B8375] leading-relaxed">
                      <strong>Anand Arts and Metal Craft</strong> does not offer Cash On Delivery (COD). All orders must be prepaid through our secured payment gateways.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mt-12 pt-12 border-t border-black/5 bg-[var(--color-brand-char)] text-white p-12 rounded-[40px] text-center">
                <h3 className="font-display text-2xl uppercase tracking-widest mb-6">Estimate Shipping Charge</h3>
                <p className="text-[#8B8375] mb-8 text-sm max-w-xl mx-auto">
                  Contact us for an approximate estimation of the shipping charge for your international order or custom commissions.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <a href="tel:+918754262271" className="flex items-center gap-3 text-[var(--color-brand-gold)] font-display text-xl hover:underline">
                    +91 87542 62271
                  </a>
                  <a href="mailto:anandartsandmetalcraft@gmail.com" className="flex items-center gap-3 text-[var(--color-brand-gold)] font-display text-xl hover:underline">
                    anandartsandmetalcraft@gmail.com
                  </a>
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
