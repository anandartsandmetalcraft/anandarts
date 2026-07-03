import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Custom Idol Makers in Bangalore | Anand Arts",
  description: "Commission custom brass, bronze, copper, panchaloha, and wood temple art from Anand Arts Bengaluru for homes, temples, interiors, and gifting.",
  path: "/custom-idols-in-bangalore",
  keywords: ["custom idol makers Bangalore", "custom idols in Bangalore", "custom panchaloha idol"],
});

export default function CustomIdolsInBangalorePage() {
  return (
    <SeoLandingPage
      eyebrow="Custom Sacred Commissions"
      title="Custom Idol Makers in Bangalore"
      intro="Commission bespoke brass, bronze, copper, panchaloha, and wood temple art with Anand Arts for homes, temples, interior projects, and meaningful gifting."
      path="/custom-idols-in-bangalore"
      primaryCta="Start a Commission"
      sections={[
        {
          title: "Made to Context",
          body: "A custom idol should match the space, purpose, deity form, material preference, and viewing distance. Anand Arts helps buyers think through size, finish, and placement before production.",
        },
        {
          title: "Material Guidance",
          body: "Brass is a strong choice for daily worship and decorative sacred spaces. Bronze and panchaloha suit premium temple-style commissions, heirloom pieces, and larger devotional installations.",
        },
        {
          title: "For Homes and Temples",
          body: "Custom commissions can support pooja rooms, temple spaces, hospitality interiors, corporate gifting, and collectors who want a specific deity, posture, or South Indian craft style.",
        },
      ]}
      faqs={[
        {
          question: "Can I order a custom idol in Bangalore?",
          answer: "Yes. Anand Arts supports custom idol and temple-art commissions from Bengaluru based on material, size, deity, reference images, and intended placement.",
        },
        {
          question: "Which material is best for custom idols?",
          answer: "Brass is practical and durable for many home pooja requirements. Bronze and panchaloha are preferred for premium, temple-style, and heirloom custom commissions.",
        },
        {
          question: "What details are needed for a custom idol quote?",
          answer: "Share the deity or subject, height, preferred material, finish, reference image if available, placement location, deadline, and whether the piece is for worship, decor, gifting, or temple use.",
        },
      ]}
    />
  );
}

