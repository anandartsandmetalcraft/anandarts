"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Scale, Lock, ChevronRight, Gavel, User, Search, Info } from "lucide-react";
import Link from "next/link";

const LEGAL_GROUPS = [
  {
    title: "Essential Policies",
    items: [
      { id: "terms", title: "Terms & Condition", icon: Gavel, path: "/legal/terms-of-service", desc: "Our fundamental store rules." },
      { id: "privacy", title: "Privacy Policy", icon: Lock, path: "/legal/privacy-policy", desc: "How we protect your data." },
    ]
  },
  {
    title: "Orders & Shipping",
    items: [
      { id: "shipping", title: "Shipping Policy", icon: Truck, path: "/legal/shipping-policy", desc: "Delivery timelines and care." },
      { id: "returns", title: "Return & Exchange", icon: RefreshCw, path: "/legal/refund-policy", desc: "Quality assurance and returns." },
      { id: "refund", title: "Refund Policy", icon: Scale, path: "/legal/refund-policy", desc: "Money back and cancellations." },
    ]
  },
  {
    title: "Account & Help",
    items: [
      { id: "account", title: "My Account", icon: User, path: "/account", desc: "Manage your profile." },
      { id: "track", title: "Track Order", icon: Search, path: "/account", desc: "Check your shipment status." },
    ]
  }
];

// Helper to avoid import issues in this scratch environment
function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] pt-32 pb-24">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        <header className="mb-20 text-center">
          <div className="inline-flex items-center gap-4 font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-brand-gold)] mb-4 px-6 py-2 bg-white/40 rounded-full border border-black/5">
             <ShieldCheck size={16} /> 
             Help & Legal Center
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-[var(--color-brand-char)] uppercase tracking-tight leading-tight mt-6">
             Anand Arts <br/> <span className="text-[#8B8375]">Support Hub</span>
          </h1>
        </header>

        <div className="space-y-20">
          {LEGAL_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-8">
              <h2 className="font-ui text-xs font-bold uppercase tracking-[0.4em] text-[var(--color-brand-gold)] border-b border-[var(--color-brand-gold)]/20 pb-4 inline-block">
                {group.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {group.items.map((item, iIdx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (gIdx * 0.2) + (iIdx * 0.1) }}
                  >
                    <Link 
                      href={item.path}
                      className="group bg-white rounded-[32px] p-8 shadow-sm border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-cream)] flex items-center justify-center text-[var(--color-brand-gold)] group-hover:bg-[var(--color-brand-gold)] group-hover:text-white transition-all">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <h3 className="font-display text-lg text-[var(--color-brand-char)] uppercase tracking-widest">{item.title}</h3>
                          <p className="text-[11px] text-[#8B8375] uppercase font-bold tracking-widest opacity-60">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[var(--color-brand-gold)] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <section className="mt-24 p-12 bg-white rounded-[48px] border border-black/5 text-center shadow-sm">
           <div className="w-20 h-20 bg-[var(--color-brand-cream)] rounded-full flex items-center justify-center mx-auto mb-8">
              <Info size={32} className="text-[var(--color-brand-gold)]" />
           </div>
           <h4 className="font-display text-3xl text-[var(--color-brand-char)] uppercase tracking-widest mb-6">Need Further Assistance?</h4>
           <p className="text-[#8B8375] max-w-2xl mx-auto mb-10 leading-relaxed">
              Our master artisans and support team are dedicated to ensuring your experience with Anand Arts is divine. Reach out to us for any custom queries or help.
           </p>
           <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="px-10 py-4 bg-[var(--color-brand-char)] text-white font-ui text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[var(--color-brand-gold)] transition-all shadow-xl">
                 Contact Us
              </Link>
              <a href="mailto:support@anandartsandmetalcrafts.com" className="px-10 py-4 border border-black/10 text-[var(--color-brand-char)] font-ui text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-black hover:text-white transition-all">
                 Email Support
              </a>
           </div>
        </section>

        <div className="mt-8 text-center font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B8375]">
          Website developed by{" "}
          <a
            href="https://gagan-portfolio-theta.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-brand-gold)] underline underline-offset-4 transition-colors hover:text-[var(--color-brand-char)]"
          >
            Gagan
          </a>
        </div>
      </div>
    </main>
  );
}
