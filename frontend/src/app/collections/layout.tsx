import React from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Collections | Brass, Bronze, Copper & Panchaloha Idols",
  description: "Explore Anand Arts collections of brass idols, bronze idols, copper idols, panchaloha idols, deepams, bells, pooja room decor, and custom temple art.",
  path: "/collections",
  keywords: ["brass idols online India", "bronze idols online", "copper god idols online", "panchaloha idols online"],
});

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
