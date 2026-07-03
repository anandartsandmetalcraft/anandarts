import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Panchaloha Idols Online | Custom Sacred Commissions",
  description: "Explore panchaloha idol guidance and custom commission support for premium sacred pieces, temple installations, and devotional collectors.",
  path: "/collections/panchaloha-idols",
  keywords: ["panchaloha idols online", "custom panchaloha idol", "panchalogam idols"],
});

export default function PanchalohaIdolsPage() {
  return (
    <SeoLandingPage
      eyebrow="Premium Sacred Commissions"
      title="Panchaloha Idols Online"
      intro="Panchaloha idols are chosen for premium sacred commissions, temple-inspired spaces, devotional collectors, and custom heirloom pieces."
      path="/collections/panchaloha-idols"
      sections={[
        {
          title: "Sacred Material Choice",
          body: "Panchaloha is associated with traditional idol-making and premium sacred works. It is often selected when the piece has devotional, ceremonial, or heirloom importance.",
        },
        {
          title: "Custom First",
          body: "Many panchaloha requirements are best handled through consultation because size, deity form, iconography, finish, and placement affect the final work.",
        },
        {
          title: "For Serious Buyers",
          body: "Panchaloha pieces are suited for temples, collectors, custom home mandirs, interior projects, and buyers seeking a meaningful long-term sacred object.",
        },
      ]}
      faqs={[
        {
          question: "What is panchaloha used for?",
          answer: "Panchaloha is traditionally associated with sacred idols and premium devotional pieces, especially where ritual significance and long-term preservation matter.",
        },
        {
          question: "Can I order a custom panchaloha idol?",
          answer: "Yes. Anand Arts can discuss custom panchaloha idol requirements based on deity, size, finish, reference style, and intended placement.",
        },
        {
          question: "Is panchaloha better than brass?",
          answer: "It depends on the purpose. Brass is practical for many home pooja needs, while panchaloha is usually chosen for premium, ceremonial, or custom sacred commissions.",
        },
      ]}
    />
  );
}

