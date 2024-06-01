import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';
import Category from '@/blog/Category';

export default async (app: FastifyInstance) => {
  type CategoryRequest = FastifyRequest<{ Params: { categoryId: string }; Querystring: { page?: number } }>;
  app.get('/:categoryId', async (req: CategoryRequest, reply: FastifyReply) => {
    const { categoryId } = req.params;
    const category = new Category(categoryId);

    if (!category.metaData) {
      return reply.callNotFound();
    }

    const blogPostIndex = new BlogPostIndex(req.query.page);
    await blogPostIndex.getPostsByCategory(categoryId);
    const templateData = await blogPostIndex.getTemplateData();

    return reply.render('_blog/index.ejs', {
      req,
      title: category.metaData.name,
      pageData: {
        mainNavId: category.metaData.id,
        ...templateData,
      },
    });
  });
};
