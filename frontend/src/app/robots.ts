import { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin-login',
          '/checkout',
          '/api',
          '/account',
          '/_next',
          '/*?*sort=',
          '/*?*page=',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
