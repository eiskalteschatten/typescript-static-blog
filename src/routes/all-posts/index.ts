import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import categories from '@data/categories.json';

import BlogPostIndex from '@/blog/BlogPostIndex';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const blogPostIndex = new BlogPostIndex('allPosts');
    await blogPostIndex.getPosts();

    return reply.view('all-posts/index.ejs', {
      title: 'All Posts',
      mainNavId: 'allPosts',
      blogPosts: blogPostIndex.getPostsAsItemTileItems(),
      categories,
    });
  });
};
