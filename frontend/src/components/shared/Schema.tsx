import React from 'react';

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
    name: "Anand Arts",
    url: "https://anandarts.com",
    logo: "https://anandarts.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      "telephone": "+91 84318 38722",
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
    name: "Anand Arts & Metal Craft",
    image: "https://anandarts.com/og-image.jpg",
    "@id": "https://anandarts.com",
    url: "https://anandarts.com",
    telephone: "+91 84318 38722",
    address: {
      "@type": "PostalAddress",
      "streetAddress": "No. 12, 1st Cross, Srirampura",
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
