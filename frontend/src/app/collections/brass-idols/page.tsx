import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Brass Idols Online India | Handcrafted Temple Art",
  description: "Explore handcrafted brass idols for home pooja, temples, housewarming gifts, and sacred interiors. Crafted by Anand Arts in Bengaluru.",
  path: "/collections/brass-idols",
  keywords: ["brass idols online India", "handcrafted brass idols", "brass god idols"],
});

export default function BrassIdolsPage() {
  return (
    <SeoLandingPage
      eyebrow="Brass God Idols"
      title="Brass Idols Online India"
      intro="Explore brass idols and sacred metal craft for home pooja rooms, temples, festive gifting, interior decor, and devotional collections."
      path="/collections/brass-idols"
      sections={[
        {
          title: "Why Brass",
          body: "Brass is valued for strength, traditional appeal, warm tone, and everyday durability, making it a practical material for home pooja idols, lamps, bells, and sacred decor.",
        },
        {
          title: "What to Check",
          body: "When buying a brass idol, check height, weight, finish, facial detailing, base stability, handwork quality, packaging, and whether the product suits daily worship or display.",
        },
        {
          title: "Best Uses",
          body: "Brass idols are suitable for pooja rooms, housewarming gifts, office spaces, festive gifting, mandir decor, and collectors who prefer traditional Indian metal craft.",
        },
      ]}
      faqs={[
        {
          question: "Are brass idols suitable for daily worship?",
          answer: "Yes. Brass idols are durable and traditional, making them suitable for daily worship when cleaned gently and placed in a stable, respectful pooja space.",
        },
        {
          question: "How do I choose the right brass idol size?",
          answer: "Choose small idols for compact shelves, medium idols for home mandirs, and larger idols for dedicated pooja rooms, temple spaces, or statement interiors.",
        },
        {
          question: "Do brass idols need special care?",
          answer: "Use a soft dry cloth for regular cleaning. Avoid harsh chemicals on detailed idols unless the finish and care instructions specifically allow it.",
        },
      ]}
    />
  );
}

