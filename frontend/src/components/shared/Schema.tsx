import React from 'react';
import { siteBrand, siteUrl } from '@/lib/seo';

interface SchemaProps {
  type: 'Organization' | 'LocalBusiness' | 'Product' | 'WebSite' | 'WebPage' | 'FAQPage' | 'CollectionPage' | 'AboutPage';
  data: any;
}

const Schema: React.FC<SchemaProps> = ({ type, data }) => {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': data['@type'] || type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseData) }}
    />
  );
};

export default Schema;

// Pre-defined Schemas for Anand Arts
export const AnandArtsSchema = {
  Organization: {
    name: siteBrand.name,
    legalName: siteBrand.legalName,
    url: siteUrl,
    logo: `${siteUrl}/Logo.png`,
    description: "Bengaluru-based temple art studio for handcrafted brass idols, bronze idols, copper idols, panchaloha idols, wood carvings, and custom sacred commissions.",
    contactPoint: {
      "@type": "ContactPoint",
      "telephone": siteBrand.phone,
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi", "Kannada", "Tamil"]
    },
    sameAs: [
      "https://www.facebook.com/Anandsingh9268/",
      "https://www.instagram.com/reel/DKQBl6PzG9D/"
    ]
  },
  LocalBusiness: {
    name: siteBrand.legalName,
    image: `${siteUrl}/Logo.png`,
    "@id": siteUrl,
    url: siteUrl,
    telephone: siteBrand.phone,
    priceRange: "INR",
    currenciesAccepted: "INR",
    paymentAccepted: "UPI, Credit Card, Debit Card, Netbanking",
    areaServed: ["Bengaluru", "Karnataka", "India"],
    address: {
      "@type": "PostalAddress",
      "streetAddress": "2/4, 10th A, Laxmi Narayanpuram, Srirampura",
      "addressLocality": "Bengaluru",
      "postalCode": "560021",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    },
    geo: {
      "@type": "GeoCoordinates",
      "latitude": 12.9905,
      "longitude": 77.5712
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "10:00",
      "closes": "20:00"
    }
  }
};
