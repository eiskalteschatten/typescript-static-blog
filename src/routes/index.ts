import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';

export default async (app: FastifyInstance) => {
  type PostsRequest = FastifyRequest<{ Querystring: { page?: number } }>;
  app.get('/', async (req: PostsRequest, reply: FastifyReply) => {
    const blogPostIndex = new BlogPostIndex(req.query.page);
    await blogPostIndex.getAllPosts();
    const templateData = await blogPostIndex.getTemplateData();

    return reply.render('_blog/index.ejs', req, {
      mainNavId: 'home',
      ...templateData,
    });
  });
};
