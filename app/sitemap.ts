import { MetadataRoute } from 'next';
import { diseaseRegistry } from '@/data/disease-registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://nyhealthwatch.org';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                        lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/diseases`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/data`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/about`,             lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/methodology`,       lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/disclaimers`,       lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/in-the-news`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.5 },
  ];

  const diseasePages: MetadataRoute.Sitemap = diseaseRegistry
    .filter(d => d.hasDetailPage)
    .map(d => ({
      url: `${base}/diseases/${d.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  return [...staticPages, ...diseasePages];
}
