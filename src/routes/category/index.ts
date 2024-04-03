import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';
import Category from '@/blog/Category';

export default async (app: FastifyInstance) => {
  type PostsRequest = FastifyRequest<{ Params: { categoryId: string }; Querystring: { page?: number } }>;
  app.get('/:categoryId', async (req: PostsRequest, reply: FastifyReply) => {
    const { categoryId } = req.params;
    const category = new Category(categoryId);

    if (!category.metaData) {
      return reply.code(404).view('404.ejs');
    }

    const blogPostIndex = new BlogPostIndex(req.query.page);
    await blogPostIndex.getPostsByCategory(categoryId);
    const templateData = await blogPostIndex.getTemplateData();

    return reply.view('_blog/index.ejs', {
      title: category.metaData.name,
      ...templateData,
    });
  });
};
