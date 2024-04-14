import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import RSS from 'rss';

import BlogPostIndex from '@/blog/BlogPostIndex';
import BlogPost from '@/blog/BlogPost';
import Categories from '@/blog/Categories';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const url = 'http://localhost:4000';

    const feed = new RSS({
      title: 'TypeScript Static Blog',
      description: 'A simple blog written in TypeScript that is generated statically.',
      'feed_url': `${url}/feed.xml`,
      'site_url': `${url}`,
      copyright: 'Copyright (c) Alex Seifert',
      language: 'en-US',
      pubDate: new Date().toISOString(),
    });

    const blogPostIndex = new BlogPostIndex();
    const postIds = await blogPostIndex.getAllPostIds();

    for (const postId of postIds) {
      const blogPost = new BlogPost(postId);
      await blogPost.getPost();

      if (BlogPost.blogPostCanBePublished(blogPost.metaData) && blogPost.parsedBody !== undefined) {
        const postCategories = Categories.getCategoriesByIds(blogPost.metaData.categories);

        feed.item({
          title: blogPost.metaData.title,
          description: blogPost.parsedBody,
          url: `${url}/post/${blogPost.metaData.id}`,
          categories: postCategories.map(category => category.name),
          author: blogPost.authors[0].name,
          date: blogPost.metaData.publishedDate,
        });
      }
    }

    return reply
      .header('Content-Type', 'application/rss+xml; charset=UTF-8')
      .send(feed.xml());
  });
};
