import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';
import Category from '@/blog/Category';

export default async (app: FastifyInstance) => {
  type PostsRequest = FastifyRequest<{ Params: { categoryId: string }; Querystring: { page?: number } }>;
  app.get('/:categoryId', async (req: PostsRequest, reply: FastifyReply) => {
    const { categoryId } = req.params;
    const category = new Category(categoryId);

    const blogPostIndex = new BlogPostIndex('category', categoryId);
    await blogPostIndex.getPosts(req.query.page);
    const getAdditionalTemplateData = await blogPostIndex.getAdditionalTemplateData();

    return reply.view('_blog/index.ejs', {
      title: category.metaData.name,
      blogPosts: blogPostIndex.getPostsAsItemTileItems(),
      ...getAdditionalTemplateData,
    });
  });
};
