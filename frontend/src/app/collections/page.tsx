import React, { Suspense } from "react";
import Link from "next/link";
import CatalogView from "@/components/collections/CatalogView";
import CategoryBar from "@/components/collections/CategoryBar";
import { getCategories } from "@/actions/products";
import { Metadata } from "next";
import Schema from "@/components/shared/Schema";

export const metadata: Metadata = {
  title: "Collections & Catalog",
  description: "Browse our complete catalog of Divine Gods, Divine Goddess, Copper, Miniature, Vintage, and Brass temple art. Handcrafted masterpieces by Anand Arts.",
  openGraph: {
    title: "Anand Arts Collections",
    description: "Browse our complete catalog of Divine Gods, Divine Goddess, Copper, Miniature, Vintage, and Brass temple art.",
    url: "https://anandarts.com/collections",
  }
};

// Server Component
export default async function CollectionsPage() {
  const categories = await getCategories();

  const collectionSchema = {
    "@type": "CollectionPage",
    "name": "Anand Arts Collections",
    "description": "Browse Divine Gods, Divine Goddess, Copper, Miniature, Vintage, and Brass creations crafted for your sacred spaces.",
    "url": "https://anandarts.com/collections"
  };

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] pt-24 pb-24 border-t border-black/5">
      <Schema type="WebPage" data={collectionSchema} />
      {/* Hero Header */}
      <div className="bg-[#11100D] text-[var(--color-brand-cream)] py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14)_0,transparent_24%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08)_0,transparent_18%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.1)_0,transparent_22%)] mix-blend-overlay pointer-events-none"></div>
        <div className="max-w-[1320px] mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-2 font-ui text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#A89F91] mb-6">
            <Link href="/" className="hover:text-[var(--color-brand-gold)] transition-colors">HOME</Link>
            <span className="text-[var(--color-brand-gold)] text-[14px]">✦</span>
            <span className="text-white">COLLECTIONS</span>
          </div>
          <span className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-brand-gold)] mb-4 block">
            Discover Devotion
          </span>
          <h1 className="font-display text-4xl md:text-[56px] text-[#E8E1D5] mb-6">
            Our Collections
          </h1>
          <p className="font-script text-lg md:text-xl text-[#A89F91] max-w-2xl mx-auto italic">
            "Browse Divine Gods, Divine Goddess, Copper, Miniature, Vintage, and Brass creations crafted for your sacred spaces."
          </p>
        </div>
      </div>

      {/* Dynamic Category Bar */}
      <Suspense fallback={<div className="h-[92px] w-full border-b border-black/5 bg-white/80" />}>
        <CategoryBar initialCategories={categories} />
      </Suspense>

      {/* Main Catalog Application */}
      <Suspense
        fallback={
          <div className="max-w-[1320px] mx-auto px-4 md:px-12 py-12 text-sm text-[var(--color-brand-slate)]">
            Loading collections...
          </div>
        }
      >
        <CatalogView />
      </Suspense>
    </main>
  );
}
