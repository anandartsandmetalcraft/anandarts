import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { seoLandingRoutes, siteUrl } from '@/lib/seo'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  
  // Fetch all active products for the sitemap
  const products = await db.product.findMany({
    where: { isActive: true },
    select: { id: true, updatedAt: true }
  })

  const productUrls = products.map((product) => ({
    url: `${siteUrl}/product/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const staticUrls = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/collections`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/custom-commissions`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${siteUrl}/track-order`,
      lastModified: now,
      changeFrequency: 'always' as const,
      priority: 0.5,
    }
  ]

  const seoUrls = seoLandingRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route.path.includes('bangalore') ? 0.92 : 0.88,
  }))

  return [...staticUrls, ...seoUrls, ...productUrls]
}
