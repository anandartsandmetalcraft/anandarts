import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Copper God Idols Online | Anand Arts",
  description: "Buy copper god idols and sacred metal crafts for pooja rooms, gifting, and traditional interiors from Anand Arts Bengaluru.",
  path: "/collections/copper-idols",
  keywords: ["copper god idols online", "copper idols India", "copper murti online"],
});

export default function CopperIdolsPage() {
  return (
    <SeoLandingPage
      eyebrow="Copper Sacred Craft"
      title="Copper God Idols Online"
      intro="Copper idols and sacred metal crafts bring a traditional, warm, and devotional character to pooja rooms, gifting, and Indian interiors."
      path="/collections/copper-idols"
      sections={[
        {
          title: "Traditional Appeal",
          body: "Copper has long been associated with ritual use and sacred spaces in India, making copper idols and accessories meaningful for devotional environments.",
        },
        {
          title: "Buying Guidance",
          body: "Check the size, finish, stability, detailing, and care requirements before selecting a copper idol for daily worship or decorative use.",
        },
        {
          title: "Gifting Use",
          body: "Copper idols and sacred accessories can work well for housewarming gifts, festival gifting, and pooja room upgrades when matched to the recipient's space.",
        },
      ]}
      faqs={[
        {
          question: "Are copper idols good for worship?",
          answer: "Copper idols can be suitable for worship and sacred spaces when crafted well and cared for properly. Always choose a stable size and finish for the intended use.",
        },
        {
          question: "How should copper idols be maintained?",
          answer: "Keep copper idols dry after cleaning, use gentle cloth care, and avoid harsh abrasives unless the care instructions allow them.",
        },
        {
          question: "Can I gift copper god idols?",
          answer: "Yes. Copper god idols can be meaningful gifts for housewarming, festivals, pooja room setup, and spiritual occasions.",
        },
      ]}
    />
  );
}

