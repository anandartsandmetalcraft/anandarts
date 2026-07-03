import type { Metadata } from "next";

export const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.anandartsandmetalcrafts.com";

export const siteBrand = {
  name: "Anand Arts",
  legalName: "Anand Arts & Metal Craft",
  phone: "+91 84318 38722",
  email: "anandartsandmetalcraft@gmail.com",
  address: "2/4, 10th A, Laxmi Narayanpuram, Srirampura, Bengaluru, Karnataka 560021",
  locality: "Bengaluru",
  region: "Karnataka",
  country: "IN",
};

export const priorityKeywords = [
  "brass idols online India",
  "brass idols in Bangalore",
  "brass idols in Bengaluru",
  "bronze idols online",
  "copper god idols online",
  "panchaloha idols online",
  "custom idol makers Bangalore",
  "temple art Bengaluru",
  "South Indian temple art",
  "handcrafted brass idols",
  "brass Ganesha idol",
  "brass Lakshmi idol",
  "Nataraja statue",
  "pooja room idols",
  "custom panchaloha idol",
  "Bengaluru temple art studio",
  "handcrafted metal crafts India",
  "authentic Hindu god idols",
];

export const seoLandingRoutes = [
  {
    path: "/brass-idols-in-bangalore",
    title: "Brass Idols in Bangalore | Anand Arts Bengaluru",
    description:
      "Buy authentic handcrafted brass idols in Bangalore from Anand Arts. Explore Ganesha, Lakshmi, Nataraja, Vishnu, deepams, bells, and custom temple-art commissions.",
    keywords: ["brass idols in Bangalore", "brass idols in Bengaluru", "brass statue shop Bangalore"],
  },
  {
    path: "/custom-idols-in-bangalore",
    title: "Custom Idol Makers in Bangalore | Anand Arts",
    description:
      "Commission custom brass, bronze, copper, panchaloha, and wood temple art from Anand Arts Bengaluru for homes, temples, interiors, and gifting.",
    keywords: ["custom idol makers Bangalore", "custom panchaloha idol", "temple art studio Bengaluru"],
  },
  {
    path: "/collections/brass-idols",
    title: "Brass Idols Online India | Handcrafted Temple Art",
    description:
      "Explore handcrafted brass idols for home pooja, temples, housewarming gifts, and sacred interiors. Crafted by Anand Arts in Bengaluru.",
    keywords: ["brass idols online India", "handcrafted brass idols", "brass god idols"],
  },
  {
    path: "/collections/bronze-idols",
    title: "Bronze Idols Online India | South Indian Temple Craft",
    description:
      "Discover bronze idols and sacred sculptures inspired by South Indian temple traditions, crafted for pooja rooms, collectors, and temple projects.",
    keywords: ["bronze idols online", "bronze god idols", "South Indian bronze idols"],
  },
  {
    path: "/collections/copper-idols",
    title: "Copper God Idols Online | Anand Arts",
    description:
      "Buy copper god idols and sacred metal crafts for pooja rooms, gifting, and traditional interiors from Anand Arts Bengaluru.",
    keywords: ["copper god idols online", "copper idols India", "copper murti online"],
  },
  {
    path: "/collections/panchaloha-idols",
    title: "Panchaloha Idols Online | Custom Sacred Commissions",
    description:
      "Explore panchaloha idol guidance and custom commission support for premium sacred pieces, temple installations, and devotional collectors.",
    keywords: ["panchaloha idols online", "custom panchaloha idol", "panchalogam idols"],
  },
];

export function absoluteUrl(path = "") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = "/Logo.png",
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords: Array.from(new Set([...keywords, ...priorityKeywords])),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: siteBrand.name,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${siteBrand.name} handcrafted temple art`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

