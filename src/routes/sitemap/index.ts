import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';
import BlogPost from '@/blog/BlogPost';

export default async (app: FastifyInstance) => {
  app.get('/posts', async (req: FastifyRequest, reply: FastifyReply) => {
    const url = 'http://localhost:4000';

    let xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';

    const blogPostIndex = new BlogPostIndex();
    const postIds = await blogPostIndex.getAllPostIds();

    for (const postId of postIds) {
      const blogPost = new BlogPost(postId);
      await blogPost.getPost();

      if (BlogPost.blogPostCanBePublished(blogPost.metaData) && blogPost.parsedBody !== undefined) {
        const lastmod = new Date(blogPost.metaData.updatedAt);

        xml += `
          <url>
            <loc>${url}/post/${blogPost.metaData.id}</loc>
            <lastmod>${lastmod.toISOString()}</lastmod>
          </url>
        `;
      }
    }

    xml += '</urlset>';

    return reply
      .header('Content-Type', 'application/rss+xml; charset=UTF-8')
      .send(xml);
  });
};
