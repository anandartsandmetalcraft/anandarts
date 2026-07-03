"use client";
import React from "react";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, ShieldCheck, Eye, Database, Globe, Mail, Phone, UserCheck, Trash2, Clock } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
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
             <Lock size={16} /> 
             Data Privacy & Trust
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-[var(--color-brand-char)] uppercase tracking-tight leading-tight mb-8">
             Privacy <br/> <span className="text-[#8B8375]">Policy</span>
          </h1>
        </header>

        <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-xl border border-black/5">
          <article className="prose prose-stone max-w-none">
            <div className="space-y-12">
              <section>
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6 flex items-center gap-3">
                  <UserCheck size={24} className="text-[var(--color-brand-gold)]" /> User Information & Privacy
                </h2>
                <p className="text-[#4A453E] leading-relaxed mb-6">
                  <strong>Anand Arts and Metal Craft</strong> is committed to protecting all the information you share with us. We follow stringent procedures to protect the confidentiality, security, and integrity of data stored on our systems. 
                </p>
                <p className="text-[#4A453E] leading-relaxed mb-6">
                  Only those employees who need access to your information in order to perform their duties are allowed such access. Anand Arts and Metal Craft's top most priority is protecting your confidential information and privacy.
                </p>
                <div className="p-8 bg-[var(--color-brand-cream)]/30 border border-black/5 rounded-3xl">
                   <p className="text-xs text-[#8B8375] leading-relaxed m-0 italic">
                     "This privacy policy tells you how we use your personal information collected through our website. Please read this policy before using the site or submitting any personal information. This policy will be updated subject to any changes in information collection, activities performed or any applicable regulations."
                   </p>
                </div>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">Collection & Use of Information</h2>
                <p className="text-[#4A453E] leading-relaxed mb-6">
                  We collect, process, and retain information about you when you visit <strong>Anand Arts and Metal Craft</strong>. You may choose to provide us with information such as:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                     "Full Name",
                     "Email Addresses",
                     "Telephone Numbers",
                     "Country, City and State",
                     "Shipping Address",
                     "Company Information (Optional)",
                     "Order and Payment References"
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-black/5 rounded-2xl shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-char)] opacity-70">{item}</span>
                     </div>
                   ))}
                </div>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">How We Use Your Information</h2>
                <div className="space-y-6">
                  <div className="flex gap-6 items-start">
                    <Eye className="text-[var(--color-brand-gold)] shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-sm uppercase mb-2">Service Excellence</h4>
                      <p className="text-sm text-[#8B8375] leading-relaxed">Your information helps us to more effectively respond to your requests and queries to make the application interface user friendly.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start">
                    <Mail className="text-[var(--color-brand-gold)] shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-sm uppercase mb-2">Periodic Communications</h4>
                      <p className="text-sm text-[#8B8375] leading-relaxed">Subject to your prior approval, we may use your information to communicate through emails, text messages, and calls regarding product updates or promotional marketing.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start">
                    <ShieldCheck className="text-[var(--color-brand-gold)] shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-sm uppercase mb-2">Payments & Fraud Prevention</h4>
                      <p className="text-sm text-[#8B8375] leading-relaxed">We use order details, payment references, and contact information to process payments, verify orders, prevent fraud, issue invoices, handle refunds, and support payment disputes where required.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="border-t border-black/5 pt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">Fairness & Purpose</h2>
                    <p className="text-sm text-[#8B8375] leading-relaxed">
                      We collect adequate, relevant and necessary Personal Information fairly and lawfully for the purpose it is collected. The purpose will be specified at or before the time of data collection.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">Information Disclosure</h2>
                    <p className="text-sm text-[#8B8375] leading-relaxed">
                      We do not share, sell, rent, or trade personal information with third parties for their promotional purposes. We only share information with contracted third-party service providers such as Cashfree Payments, shipping partners, hosting providers, analytics tools, and support vendors when required to fulfill orders, process payments, arrange delivery, prevent fraud, or comply with legal obligations.
                    </p>
                  </div>
                </div>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-8">Data Governance</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="p-8 bg-[var(--color-brand-char)] text-white rounded-[32px] flex flex-col justify-between">
                      <div>
                        <Globe size={24} className="text-[var(--color-brand-gold)] mb-6" />
                        <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Cross-Border Transfers</h4>
                      </div>
                      <p className="text-[11px] text-[#8B8375] leading-relaxed">We may transfer information outside of our operating country when necessary for business processes, ensuring all legal data transfer mechanisms and protection agreements are in place.</p>
                   </div>
                   <div className="p-8 bg-[var(--color-brand-char)] text-white rounded-[32px] flex flex-col justify-between">
                      <div>
                        <Database size={24} className="text-[var(--color-brand-gold)] mb-6" />
                        <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Data Storage</h4>
                      </div>
                      <p className="text-[11px] text-[#8B8375] leading-relaxed">We may transfer and store your information in secured databases, ensuring appropriate security controls are maintained across our own and our suppliers' systems.</p>
                   </div>
                   <div className="p-8 bg-[var(--color-brand-char)] text-white rounded-[32px] flex flex-col justify-between">
                      <div>
                        <ShieldCheck size={24} className="text-[var(--color-brand-gold)] mb-6" />
                        <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Security Commitment</h4>
                      </div>
                      <p className="text-[11px] text-[#8B8375] leading-relaxed">Only authorized personnel, vendors, and partners who have agreed to keep information confidential have access to your data. Industry-standard security measures are strictly enforced.</p>
                   </div>
                </div>
              </section>

              <section className="border-t border-black/5 pt-12">
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-8">Retention & Deletion Policy</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-[var(--color-brand-cream)]/30 border border-black/5 rounded-[32px]">
                    <Clock size={24} className="text-[var(--color-brand-gold)] mb-5" />
                    <h4 className="font-bold text-sm uppercase tracking-widest text-[var(--color-brand-char)] mb-4">How Long We Keep Data</h4>
                    <p className="text-sm text-[#8B8375] leading-relaxed">
                      We retain personal information only for as long as needed to provide our services, complete orders, manage customer support, meet tax/accounting requirements, prevent fraud, resolve disputes, and comply with applicable laws.
                    </p>
                  </div>
                  <div className="p-8 bg-[var(--color-brand-cream)]/30 border border-black/5 rounded-[32px]">
                    <Trash2 size={24} className="text-[var(--color-brand-gold)] mb-5" />
                    <h4 className="font-bold text-sm uppercase tracking-widest text-[var(--color-brand-char)] mb-4">Deletion Requests</h4>
                    <p className="text-sm text-[#8B8375] leading-relaxed">
                      You may request deletion, correction, or access to your personal information by contacting us through the details below. Once verified, we will process your request within a reasonable time, unless retention is required for legal, security, tax, or order-record purposes.
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-4 text-sm text-[#8B8375] leading-relaxed">
                  <p>
                    Payments are processed through Cashfree Payments. We do not store full card numbers, CVV, UPI PIN, netbanking passwords, or other sensitive payment credentials on our website. Cashfree may process payment information according to its own security and compliance standards.
                  </p>
                  <p>
                    Order, invoice, payment reference, shipping, refund, and communication records may be retained where necessary for business records, statutory compliance, accounting, warranty/support, fraud prevention, or dispute resolution.
                  </p>
                  <p>
                    Marketing and newsletter information can be removed from our promotional lists upon request or by using available unsubscribe options. Some non-promotional messages, such as order confirmations or shipping updates, may still be sent when required to complete a transaction.
                  </p>
                  <p>
                    Backup copies may remain for a limited period in secure archives before being deleted or overwritten according to our normal backup cycle.
                  </p>
                </div>
              </section>

              <section className="mt-12 pt-12 border-t border-black/5 bg-[var(--color-brand-gold)] p-12 rounded-[40px] text-center">
                <h3 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)] mb-6">Privacy Contact</h3>
                <p className="text-[var(--color-brand-char)] mb-8 text-sm opacity-70">
                  If you have questions regarding our Privacy Statement or if you need to update, change, or remove your information:
                </p>
                <div className="flex flex-wrap justify-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <Mail size={20} className="text-[var(--color-brand-char)]" />
                    <a href="mailto:anandartsandmetalcraft@gmail.com" className="font-bold uppercase tracking-widest text-[var(--color-brand-char)] text-xs hover:underline">anandartsandmetalcraft@gmail.com</a>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Phone size={20} className="text-[var(--color-brand-char)]" />
                    <a href="tel:+918754262271" className="font-bold uppercase tracking-widest text-[var(--color-brand-char)] text-xs hover:underline">+91 87542 62271</a>
                  </div>
                </div>
              </section>

              <section className="border-t border-black/5 pt-8 text-center">
                <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B8375]">
                  Website developed by{" "}
                  <a
                    href="https://gagan-portfolio-theta.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-brand-gold)] underline underline-offset-4 transition-colors hover:text-[var(--color-brand-char)]"
                  >
                    Gagan
                  </a>
                </p>
              </section>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
