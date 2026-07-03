import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import HeroCategories from "@/components/home/HeroCategories";
import TrustTicker from "@/components/home/TrustTicker";
import LoginOfferPrompt from "@/components/home/LoginOfferPrompt";
import Schema from "@/components/shared/Schema";
import { siteUrl } from "@/lib/seo";

// Lazy load below-the-fold components
const PriceFilters = dynamic(() => import("@/components/home/PriceFilters"));
const BestsellersRail = dynamic(() => import("@/components/home/BestsellersRail"));
const CatalogPreview = dynamic(() => import("@/components/home/CatalogPreview"));
const FeaturedCollections = dynamic(() => import("@/components/home/FeaturedCollections"));
const RecommendationSystem = dynamic(() => import("@/components/collections/RecommendationSystem"));
const BrandStory = dynamic(() => import("@/components/home/BrandStory"));
const SupplyChainComparison = dynamic(() => import("@/components/home/SupplyChainComparison"));
const FinishingComparison = dynamic(() => import("@/components/home/FinishingComparison"));
const CustomCommissions = dynamic(() => import("@/components/home/CustomCommissions"));
const TrustCounter = dynamic(() => import("@/components/home/TrustCounter"));
const Testimonials = dynamic(() => import("@/components/home/Testimonials"));
const FAQ = dynamic(() => import("@/components/home/FAQ"));

export default function Home() {
  const websiteSchema = {
    name: "Anand Arts",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      "target": `${siteUrl}/collections?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const faqSchema = {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How are the products shipped safely?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We use secure, triple-layered packaging for all items. Every shipment is fully insured and handled by trusted delivery partners to ensure your product arrives in perfect condition."
        }
      },
      {
        "@type": "Question",
        "name": "Can I request a custom size or specific material?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Our master artisans can craft pieces in specific heights (from 6 inches to life-size) and materials including Temple Brass, Panchaloha Bronze, Pure Silver, and Krishna Shila Stone."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide authenticity certificates?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, every primary piece from Anand Arts comes with a signed Certificate of Authenticity, detailing the material composition and artisan lineage."
        }
      }
    ]
  };

  return (
    <main className="relative">
      <Schema type="WebSite" data={websiteSchema} />
      <Schema type="FAQPage" data={faqSchema} />
      <HeroCategories />
      <Hero />
      <TrustTicker />
      <PriceFilters />
      <BestsellersRail />
      <CatalogPreview />
      <FeaturedCollections />
      <RecommendationSystem />
      <BrandStory />
      <SupplyChainComparison />
      <FinishingComparison />
      <CustomCommissions />
      <TrustCounter />
      <Testimonials />
      <FAQ />
      <LoginOfferPrompt />
    </main>
  );
}
