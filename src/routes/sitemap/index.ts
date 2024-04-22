import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fs from 'node:fs';
import path from 'node:path';

import BlogPostIndex from '@/blog/BlogPostIndex';
import BlogPost from '@/blog/BlogPost';
import Categories from '@/blog/Categories';
import Tags from '@/blog/Tags';

import authors from '@data/authors.json';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://www.developers-notebook.com';
const buildDateFile = path.resolve(process.cwd(), '.cache', 'buildDate.txt');

export default async (app: FastifyInstance) => {
  app.get('.xml', async (req: FastifyRequest, reply: FastifyReply) => {
    const lastmod = await fs.promises.readFile(buildDateFile, 'utf-8');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          <sitemap>
              <loc>${url}/sitemap/pages/</loc>
              <lastmod>${lastmod}</lastmod>
          </sitemap>
          <sitemap>
              <loc>${url}/sitemap/posts/</loc>
              <lastmod>${lastmod}</lastmod>
          </sitemap>
          <sitemap>
              <loc>${url}/sitemap/categories/</loc>
              <lastmod>${lastmod}</lastmod>
          </sitemap>
          <sitemap>
              <loc>${url}/sitemap/tags/</loc>
              <lastmod>${lastmod}</lastmod>
          </sitemap>
          <sitemap>
              <loc>${url}/sitemap/authors/</loc>
              <lastmod>${lastmod}</lastmod>
          </sitemap>
      </sitemapindex>
    `;

    return reply
      .header('Content-Type', 'application/rss+xml; charset=UTF-8')
      .send(xml);
  });

  app.get('/pages', async (req: FastifyRequest, reply: FastifyReply) => {
    const lastmod = await fs.promises.readFile(buildDateFile, 'utf-8');
    let xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';

    const pages = [
      '/',
      '/about/',
      '/all-articles/',
      '/archive/',
      '/categories/',
      '/contact/',
      '/imprint/',
      '/podcast/',
      '/privacy-statement/',
      '/support/',
    ];

    for (const page of pages) {
      xml += `
        <url>
          <loc>${url}${page}</loc>
          <lastmod>${lastmod}</lastmod>
        </url>
      `;
    }

    xml += '</urlset>';

    return reply
      .header('Content-Type', 'application/rss+xml; charset=UTF-8')
      .send(xml);
  });

  app.get('/posts', async (req: FastifyRequest, reply: FastifyReply) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';

    const blogPostIndex = new BlogPostIndex();
    const postIds = await blogPostIndex.getAllPostIds();

    for (const postId of postIds) {
      const blogPost = new BlogPost(postId);
      await blogPost.getPost();

      if (BlogPost.blogPostCanBePublished(blogPost.metaData) && blogPost.parsedBody !== undefined) {
        xml += `
          <url>
            <loc>${url}/post/${blogPost.metaData.id}/</loc>
            <lastmod>${blogPost.metaData.updatedAt}</lastmod>
          </url>
        `;
      }
    }

    xml += '</urlset>';

    return reply
      .header('Content-Type', 'application/rss+xml; charset=UTF-8')
      .send(xml);
  });

  app.get('/categories', async (req: FastifyRequest, reply: FastifyReply) => {
    const lastmod = await fs.promises.readFile(buildDateFile, 'utf-8');
    let xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';

    const categories = Categories.getSorted();

    for (const category of categories) {
      xml += `
        <url>
          <loc>${url}/category/${category.id}/</loc>
          <lastmod>${lastmod}</lastmod>
        </url>
      `;
    }

    xml += '</urlset>';

    return reply
      .header('Content-Type', 'application/rss+xml; charset=UTF-8')
      .send(xml);
  });

  app.get('/tags', async (req: FastifyRequest, reply: FastifyReply) => {
    const lastmod = await fs.promises.readFile(buildDateFile, 'utf-8');
    let xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';

    const tags = await Tags.getAllTags();

    for (const tag of tags) {
      xml += `
        <url>
          <loc>${url}/tag/${tag.slug}/</loc>
          <lastmod>${lastmod}</lastmod>
        </url>
      `;
    }

    xml += '</urlset>';

    return reply
      .header('Content-Type', 'application/rss+xml; charset=UTF-8')
      .send(xml);
  });

  app.get('/authors', async (req: FastifyRequest, reply: FastifyReply) => {
    const lastmod = await fs.promises.readFile(buildDateFile, 'utf-8');
    let xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';

    for (const author of authors) {
      xml += `
        <url>
          <loc>${url}/author/${author.id}/</loc>
          <lastmod>${lastmod}</lastmod>
        </url>
      `;
    }

    xml += '</urlset>';

    return reply
      .header('Content-Type', 'application/rss+xml; charset=UTF-8')
      .send(xml);
  });
};
