import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    year: z.number(),
    category: z.enum(['Musik', 'Poesi', 'Filmbusiness']),
    role: z.string(),
    client: z.string(),
    poster: z.string(),
    embed_url: z.string().optional(),
    clip_url: z.string().optional(),
    stills: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    excerpt: z.string(),
    external_url: z.string().url().optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
};
