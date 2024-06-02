import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const blogPostIndex = new BlogPostIndex();
    await blogPostIndex.getAllPosts();
    const templateData = await blogPostIndex.getTemplateData();

    return reply.render('_blog/index.ejs', req, {
      mainNavId: 'home',
      ...templateData,
    });
  });
};
