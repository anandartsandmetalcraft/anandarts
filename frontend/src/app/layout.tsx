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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://anandarts.com'),
  title: {
    default: "Anand Arts | Timeless Indian Heritage & Master Craftsmanship",
    template: "%s | Anand Arts"
  },
  description: "Authentic South Indian wood carvings, temple art, and metal crafts. Handcrafted by master artisans in Bengaluru. Custom commissions and worldwide shipping available.",
  keywords: [
    "Anand Arts", "South Indian Wood Carvings", "Temple Art Bengaluru", 
    "Traditional Metal Crafts", "Brass Idols India", "Bronze Murthis", 
    "Master Artisans", "Heritage Handicrafts", "Custom Religious Art",
    "Pooja Room Decor", "Indian Sculpture Commissions"
  ],
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
    url: "https://anandarts.com",
    siteName: "Anand Arts",
    title: "Anand Arts | Masterpieces of Indian Craftsmanship",
    description: "Experience the legacy of master artisans. From divine wood carvings to intricate metal crafts.",
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
    title: "Anand Arts | Timeless Indian Heritage",
    description: "Discover handcrafted temple art and master craftsmanship from South India.",
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
