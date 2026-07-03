import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Brass Idols in Bangalore | Anand Arts Bengaluru",
  description: "Buy authentic handcrafted brass idols in Bangalore from Anand Arts. Explore Ganesha, Lakshmi, Nataraja, Vishnu, deepams, bells, and custom temple-art commissions.",
  path: "/brass-idols-in-bangalore",
  keywords: ["brass idols in Bangalore", "brass idols in Bengaluru", "brass statue shop Bangalore"],
});

export default function BrassIdolsInBangalorePage() {
  return (
    <SeoLandingPage
      eyebrow="Bengaluru Temple Art Studio"
      title="Brass Idols in Bangalore"
      intro="Anand Arts crafts and curates brass idols for home pooja rooms, temples, gifting, interiors, and sacred collections from its Bengaluru studio."
      path="/brass-idols-in-bangalore"
      sections={[
        {
          title: "Built for Devotion",
          body: "Our brass idols are selected for clear detailing, balanced proportions, durable finish, and daily worship use. Buyers can explore Ganesha, Lakshmi, Nataraja, Vishnu, Krishna, Hanuman, deepams, bells, and pooja room pieces.",
        },
        {
          title: "Bengaluru Advantage",
          body: "Local buyers can speak directly with the Anand Arts team for size guidance, pooja room suitability, pickup support, and custom requirements before choosing a piece.",
        },
        {
          title: "Secure Buying",
          body: "Every order is supported with careful packaging, GST invoice availability, secure Cashfree payments, and delivery tracking for a smoother buying experience.",
        },
      ]}
      faqs={[
        {
          question: "Where can I buy brass idols in Bangalore?",
          answer: "You can buy handcrafted brass idols from Anand Arts in Bengaluru through the online collection or by contacting the studio for guidance on size, deity, finish, and custom requirements.",
        },
        {
          question: "Are brass idols good for home pooja?",
          answer: "Yes. Brass is durable, traditional, and suitable for daily worship, pooja rooms, gifting, and sacred home decor when the idol is proportioned and finished well.",
        },
        {
          question: "Can Anand Arts make custom brass idols?",
          answer: "Yes. Anand Arts accepts custom temple-art and idol commission requests based on size, material, reference style, placement, and intended use.",
        },
      ]}
    />
  );
}

