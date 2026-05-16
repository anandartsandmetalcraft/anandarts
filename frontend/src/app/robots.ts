import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://anandarts.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/checkout',
        '/api',
        '/account',
        '/_next',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
