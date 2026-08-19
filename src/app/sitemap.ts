import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';
import { SITE } from '@/lib/constants';

export default function sitemap():MetadataRoute.Sitemap{const pages=['','/portfolio','/a-propos','/services','/contact'];return [...pages.map(path=>({url:`${SITE.url}${path}`,lastModified:new Date(),changeFrequency:path===''?'monthly' as const:'yearly' as const,priority:path===''?1:.8})),...projects.map(p=>({url:`${SITE.url}/projet/${p.slug}`,lastModified:new Date(),changeFrequency:'yearly' as const,priority:.7}))]}
