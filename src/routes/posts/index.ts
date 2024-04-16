import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';

export default async (app: FastifyInstance) => {
  type PostsRequest = FastifyRequest<{ Querystring: { page?: number } }>;
  app.get('/', async (req: PostsRequest, reply: FastifyReply) => {
    const blogPostIndex = new BlogPostIndex(req.query.page);
    await blogPostIndex.getAllPosts();
    const templateData = await blogPostIndex.getTemplateData();

    if (blogPostIndex.posts.length === 0) {
      return reply.callNotFound();
    }

    return reply.view('_blog/index.ejs', {
      title: 'All Posts',
      mainNavId: 'allPosts',
      ...templateData,
    });
  });
};
