import type { APIRoute } from 'astro';
import { projects } from '../data/content';

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://solankineeraj03.github.io');
  const paths = ['/', ...projects.map((project) => `/projects/${project.slug}/`)];
  const urls = paths.map((path) => `  <url><loc>${new URL(path, origin).toString()}</loc></url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
