import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';
import Categories from '@/blog/Categories';
import Tags from '@/blog/Tags';

export default async (app: FastifyInstance) => {
  type PostsRequest = FastifyRequest<{ Querystring: { page?: number } }>;
  app.get('/', async (req: PostsRequest, reply: FastifyReply) => {
    const blogPostIndex = new BlogPostIndex('allPosts');
    await blogPostIndex.getPosts(req.query.page);
    const tags = await Tags.getAllTags();

    return reply.view('_blog/index.ejs', {
      title: 'All Posts',
      mainNavId: 'allPosts',
      blogPosts: blogPostIndex.getPostsAsItemTileItems(),
      categories: Categories.getSorted(),
      tags,
      currentPage: blogPostIndex.page,
      totalPages: blogPostIndex.totalPages,
    });
  });
};
