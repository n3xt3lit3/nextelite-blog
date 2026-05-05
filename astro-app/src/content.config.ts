/**
 * Content Collections schema (Astro v6).
 *
 * IMPORTANT: This file lives at src/content.config.ts (NOT src/content/config.ts).
 * Astro v6 deprecated the old `type: 'content'` API and requires an explicit
 * `loader` — we use `glob` from astro/loaders to pick up Markdown posts.
 *
 * Sprint 2 will populate src/content/blog/ with migrated .md files.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    excerpt: z.string().max(200),
    hero_image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
