"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Gavel } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] pt-32 pb-24">
      <div className="max-w-[900px] mx-auto px-6 md:px-12">
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
             <Gavel size={16} /> 
             Terms & Conditions
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-[var(--color-brand-char)] uppercase tracking-tight leading-tight mb-8">
             Terms of <br/> <span className="text-[#8B8375]">Service</span>
          </h1>
          <p className="text-sm text-[#8B8375] font-ui uppercase tracking-widest">Effective as of April 22, 2026</p>
        </header>

        <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-xl border border-black/5">
          <article className="prose prose-stone max-w-none">
            <div className="space-y-12">
              <section>
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">1. Agreement to Terms</h2>
                <p className="text-[#4A453E] leading-relaxed">
                  Welcome to <strong>Anand Arts and Metal Craft</strong>. By using our website or purchasing our products, you agree to these Terms of Service. If you do not agree with any part of these terms, please do not use our site.
                </p>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">2. Products & Artisanal Nature</h2>
                <p className="text-[#4A453E] leading-relaxed mb-4">
                  We specialize in handcrafted metal idols, murthis, and custom commissions. Because our products are made by hand:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-[#8B8375]">
                  <li>Slight variations in color, texture, and finish are normal and part of the art.</li>
                  <li>Measurements and weights are approximate.</li>
                  <li>We try our best to show accurate colors, but your screen may show them differently.</li>
                </ul>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">3. Orders & Payments</h2>
                <p className="text-[#4A453E] leading-relaxed mb-4">
                  When you place an order, you agree that all information provided is accurate. 
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-[#8B8375]">
                  <li>We reserve the right to refuse or cancel any order for any reason.</li>
                  <li>Prices are subject to change without notice.</li>
                  <li>Payments are processed securely; we do not store your full card details.</li>
                </ul>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">4. Intellectual Property</h2>
                <p className="text-[#4A453E] leading-relaxed">
                  All designs, images, and content on this site are the property of <strong>Anand Arts and Metal Craft</strong>. You may not copy, reproduce, or use our artistic designs for commercial purposes without our written permission.
                </p>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">5. Limitation of Liability</h2>
                <p className="text-[#4A453E] leading-relaxed">
                  We aim for excellence, but we are not liable for any indirect or direct damages resulting from your use of our products or website. Our maximum liability to you is limited to the amount paid for the product.
                </p>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">6. Governing Law</h2>
                <p className="text-[#4A453E] leading-relaxed">
                  These terms are governed by the laws of India. Any disputes will be handled in the courts of our local jurisdiction.
                </p>
              </section>

              <section className="border-t border-black/5 pt-12 bg-[var(--color-brand-char)] text-white p-12 rounded-[32px]">
                <h3 className="font-display text-xl uppercase tracking-widest mb-4">Contact Us</h3>
                <p className="text-[#8B8375] mb-6 leading-relaxed text-sm">
                  If you have any questions about these terms, please contact our support team.
                </p>
                <a 
                  href="mailto:contact@anandarts.com" 
                  className="text-xl font-display text-[var(--color-brand-gold)] hover:underline"
                >
                  contact@anandarts.com
                </a>
              </section>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
