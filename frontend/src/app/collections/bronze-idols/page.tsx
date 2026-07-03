import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Bronze Idols Online India | South Indian Temple Craft",
  description: "Discover bronze idols and sacred sculptures inspired by South Indian temple traditions, crafted for pooja rooms, collectors, and temple projects.",
  path: "/collections/bronze-idols",
  keywords: ["bronze idols online", "bronze god idols", "South Indian bronze idols"],
});

export default function BronzeIdolsPage() {
  return (
    <SeoLandingPage
      eyebrow="South Indian Bronze Craft"
      title="Bronze Idols Online India"
      intro="Bronze idols carry a temple-art character suited for premium pooja rooms, sacred interiors, collectors, and custom devotional commissions."
      path="/collections/bronze-idols"
      sections={[
        {
          title: "Temple Character",
          body: "Bronze has a rich visual depth and is closely associated with traditional South Indian sacred sculpture, especially for pieces inspired by temple forms.",
        },
        {
          title: "Premium Presence",
          body: "Bronze idols are often chosen when buyers want a more substantial, heirloom-like sacred object for pooja rooms, meditation spaces, or display.",
        },
        {
          title: "Commission Friendly",
          body: "For custom projects, bronze allows strong detailing and a timeless finish, making it suitable for deity forms, traditional postures, and larger sacred works.",
        },
      ]}
      faqs={[
        {
          question: "What is the difference between brass and bronze idols?",
          answer: "Brass is usually practical and warm-toned for everyday pooja and decor. Bronze has a deeper temple-art character and is often chosen for premium or custom sacred pieces.",
        },
        {
          question: "Are bronze idols good for pooja rooms?",
          answer: "Yes. Bronze idols can be used in pooja rooms and sacred interiors, especially when buyers want a traditional, substantial, and long-lasting piece.",
        },
        {
          question: "Can Anand Arts create custom bronze idols?",
          answer: "Yes. Anand Arts can discuss custom bronze idol requirements based on deity, height, finish, reference style, and placement.",
        },
      ]}
    />
  );
}

