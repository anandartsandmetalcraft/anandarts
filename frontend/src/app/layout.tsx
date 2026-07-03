import type { Metadata } from "next";
import { Playfair_Display, Inter, Lora, Hind, Kalam } from "next/font/google";
import "./globals.css";
// import LenisProvider from "@/components/providers/LenisProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";
import ScrollControls from "@/components/shared/ScrollControls";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import Schema, { AnandArtsSchema } from "@/components/shared/Schema";
import { priorityKeywords, siteUrl } from "@/lib/seo";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const hind = Hind({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-kalam",
  display: "swap",
});
 
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Anand Arts | Brass Idols, Temple Art & Custom Sacred Commissions",
    template: "%s | Anand Arts"
  },
  description: "Buy authentic handcrafted brass idols, bronze idols, copper idols, panchaloha idols, South Indian temple art, and custom sacred commissions from Anand Arts Bengaluru.",
  keywords: priorityKeywords,
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  authors: [{ name: "Anand Arts & Metal Craft" }],
  creator: "Anand Arts",
  publisher: "Anand Arts",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Anand Arts",
    title: "Anand Arts | Brass Idols, Temple Art & Custom Sacred Commissions",
    description: "Authentic South Indian brass, bronze, copper, panchaloha and wood temple art handcrafted in Bengaluru.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Anand Arts Heritage Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anand Arts | Brass Idols & South Indian Temple Art",
    description: "Discover handcrafted temple art, pooja room idols, and custom sacred commissions from Bengaluru.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} ${lora.variable} ${hind.variable} ${kalam.variable} antialiased overflow-x-hidden`}>
        <SessionProvider>
          {/* SEO/GEO/AEO Schemas */}
          <Schema type="Organization" data={AnandArtsSchema.Organization} />
          <Schema type="LocalBusiness" data={AnandArtsSchema.LocalBusiness} />
          
          {/* <LenisProvider> */}
            <Navbar />
            <div className="min-h-screen">
              {children}
            </div>
            <Footer />
            <FloatingWhatsApp />
            <ScrollControls />
            <Toaster position="bottom-right" theme="light" expand={false} richColors />
          {/* </LenisProvider> */}
        </SessionProvider>
      </body>
    </html>
  );
}
