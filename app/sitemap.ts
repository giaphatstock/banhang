import { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/server'
import { getBaseUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  try {
    const supabase = createStaticClient()
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('is_active', true)

    const productRoutes: MetadataRoute.Sitemap = (products || []).map((p) => ({
      url: `${baseUrl}/san-pham/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }))

    return [...staticRoutes, ...productRoutes]
  } catch {
    return staticRoutes
  }
}
