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
                  Welcome to <strong>Anand Arts & Metal Craft</strong> (hereinafter referred to as "Company", "we", "us", or "our"). By accessing or using our website, ordering our handcrafted artifacts, or engaging with our custom commission services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our site.
                </p>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">2. Products & Artisanal Nature</h2>
                <p className="text-[#4A453E] leading-relaxed mb-4">
                  We specialize in traditional, handcrafted metal idols, sacred sculptures, brass and bronze artifacts, and custom commissions. Because our products are individually cast, carved, and finished by master artisans:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-[#8B8375]">
                  <li>Slight variations in color tone, antique patina, engraving nuances, and surface finish are natural characteristics of authentic handcrafted metallurgy.</li>
                  <li>All stated measurements, dimensions, and weights are approximate handcrafted specifications.</li>
                  <li>While we strive to display true-to-life photography, display lighting and monitor color settings may cause slight visual variance.</li>
                </ul>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">3. Orders, Pricing & Payment Processing</h2>
                <p className="text-[#4A453E] leading-relaxed mb-4">
                  When you place an order with Anand Arts & Metal Craft:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-[#8B8375]">
                  <li>All orders placed on our website are subject to availability and acceptance. We reserve the right to decline or cancel an order in cases of pricing inaccuracies or stock unavailability.</li>
                  <li><strong>Secure Payment Gateway:</strong> Online payments are processed through RBI-authorized, PCI-DSS compliant third-party payment aggregators, including <strong>Cashfree Payments</strong>. We support Credit/Debit Cards, UPI, Net Banking, and approved digital wallets.</li>
                  <li>We do not store, capture, or have access to your full card numbers, CVV, UPI PINs, or banking passwords.</li>
                  <li>Applicable Goods & Services Tax (GST) is itemized and charged as mandated by Indian tax regulations.</li>
                </ul>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">4. Order Cancellation & Modifications</h2>
                <p className="text-[#4A453E] leading-relaxed mb-4">
                  We maintain fair and transparent cancellation guidelines:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-[#8B8375]">
                  <li><strong>Catalog Orders:</strong> Standard catalog orders may be requested for cancellation within <strong>12 hours</strong> of placement, provided the order has not been dispatched. Once dispatched, cancellations are handled under our Return & Refund Policy.</li>
                  <li><strong>Custom & Commissioned Works:</strong> Bespoke temple commissions, customized dimension idols, or personalized sculptures cannot be canceled or modified once metal casting/artisan production begins.</li>
                </ul>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">5. Intellectual Property</h2>
                <p className="text-[#4A453E] leading-relaxed">
                  All trademarks, logos, photography, product designs, sculptural patterns, text, and artwork displayed on this website are the proprietary intellectual property of <strong>Anand Arts & Metal Craft</strong>. Reproduction, duplication, or commercial exploitation of our creative assets without express written consent is strictly prohibited.
                </p>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">6. Disclaimer of Warranties & Limitation of Liability</h2>
                <p className="text-[#4A453E] leading-relaxed mb-4">
                  This website and all handcrafted items are provided on an "as-is" and "as-available" basis. To the maximum extent permitted by Indian law:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-[#8B8375]">
                  <li>We disclaim all warranties, express or implied, including merchantability and fitness for a particular religious or aesthetic purpose, beyond our stated quality assurance.</li>
                  <li>Anand Arts & Metal Craft shall not be liable for indirect, incidental, or consequential damages arising from website downtime, carrier transit delays, or third-party payment processing interruptions.</li>
                  <li>Our total cumulative liability to you for any claim arising from a transaction shall not exceed the actual purchase price paid by you for the item.</li>
                </ul>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">7. Governing Law & Dispute Resolution</h2>
                <p className="text-[#4A453E] leading-relaxed">
                  These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of India. Any disputes, claims, or controversies shall be subject to the exclusive jurisdiction of the competent courts in <strong>Bengaluru, Karnataka, India</strong>.
                </p>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">8. Grievance Redressal Officer</h2>
                <p className="text-[#4A453E] leading-relaxed mb-6">
                  In accordance with the Information Technology Act, 2000, and the Consumer Protection (E-Commerce) Rules, 2020, the details of the Grievance Redressal Officer for Anand Arts & Metal Craft are provided below:
                </p>
                <div className="p-8 bg-[var(--color-brand-cream)]/40 rounded-3xl border border-black/5 space-y-3 text-sm text-[#4A453E]">
                  <p><strong>Entity Name:</strong> ANAND ARTS & METAL CRAFT</p>
                  <p><strong>Designation:</strong> Grievance Redressal Officer</p>
                  <p><strong>Physical Address:</strong> 2/4, 10th 'A', Laxmi Narayanpuram, Srirampura, Bengaluru, Karnataka 560021, India</p>
                  <p><strong>Email:</strong> <a href="mailto:anandartsandmetalcrafts@gmail.com" className="text-[var(--color-brand-gold)] font-bold hover:underline">anandartsandmetalcrafts@gmail.com</a></p>
                  <p><strong>Contact Line:</strong> <a href="tel:+918431838722" className="text-[var(--color-brand-gold)] font-bold hover:underline">+91 84318 38722</a></p>
                  <p className="text-xs text-[#8B8375] pt-2">
                    * Consumer grievances are acknowledged within 48 hours and resolved within 30 days of receipt.
                  </p>
                </div>
              </section>

              <section className="border-t border-black/5 pt-12 bg-[var(--color-brand-char)] text-white p-12 rounded-[32px]">
                <h3 className="font-display text-xl uppercase tracking-widest mb-4">Questions & Inquiries</h3>
                <p className="text-[#8B8375] mb-6 leading-relaxed text-sm">
                  If you have any questions regarding these Terms of Service, please reach out to our team:
                </p>
                <a 
                  href="mailto:anandartsandmetalcrafts@gmail.com" 
                  className="text-xl font-display text-[var(--color-brand-gold)] hover:underline"
                >
                  anandartsandmetalcrafts@gmail.com
                </a>
              </section>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
