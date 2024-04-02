import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';
import Categories from '@/blog/Categories';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const blogPostIndex = new BlogPostIndex('allPosts');
    await blogPostIndex.getPosts();

    return reply.view('all-posts/index.ejs', {
      title: 'All Posts',
      mainNavId: 'allPosts',
      blogPosts: blogPostIndex.getPostsAsItemTileItems(),
      categories: Categories.getSorted(),
    });
  });
};
