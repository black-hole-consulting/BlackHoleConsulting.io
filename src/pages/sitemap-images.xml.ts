import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://blackholeconsulting.io';

function escape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function absoluteUrl(maybeRelative: string | undefined): string | null {
  if (!maybeRelative) return null;
  if (maybeRelative.startsWith('http')) return maybeRelative;
  return new URL(maybeRelative, SITE).toString();
}

export const GET: APIRoute = async () => {
  const blog = await getCollection('blog', ({ data }) => !data.draft);
  const projects = await getCollection('projects');

  type Entry = {
    pageUrl: string;
    images: { loc: string; title: string; caption?: string }[];
  };

  const entries: Entry[] = [];

  for (const post of blog) {
    const slug = post.id.replace(/\.md$/, '');
    const img = absoluteUrl(post.data.heroImage);
    if (img) {
      entries.push({
        pageUrl: `${SITE}/blog/${slug}/`,
        images: [
          {
            loc: img,
            title: post.data.title,
            caption: post.data.description,
          },
        ],
      });
    }
  }

  for (const project of projects) {
    const slug = project.id.replace(/\.md$/, '');
    const img = absoluteUrl(project.data.image);
    if (img) {
      entries.push({
        pageUrl: `${SITE}/projets/${slug}/`,
        images: [
          {
            loc: img,
            title: project.data.title,
            caption: project.data.description,
          },
        ],
      });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    (e) => `  <url>
    <loc>${escape(e.pageUrl)}</loc>
${e.images
  .map(
    (img) => `    <image:image>
      <image:loc>${escape(img.loc)}</image:loc>
      <image:title>${escape(img.title)}</image:title>${
        img.caption ? `\n      <image:caption>${escape(img.caption)}</image:caption>` : ''
      }
    </image:image>`
  )
  .join('\n')}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
