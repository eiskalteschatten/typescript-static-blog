import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';
import Tag from '@/blog/Tag';

export default async (app: FastifyInstance) => {
  type PostsRequest = FastifyRequest<{ Params: { tagSlug: string }; Querystring: { page?: number } }>;
  app.get('/:tagSlug', async (req: PostsRequest, reply: FastifyReply) => {
    const { tagSlug } = req.params;
    const tag = new Tag(tagSlug);
    await tag.getTagMetaData();

    const blogPostIndex = new BlogPostIndex(req.query.page);
    await blogPostIndex.getPostsByTag(tagSlug);
    const templateData = await blogPostIndex.getTemplateData();

    return reply.view('_blog/index.ejs', {
      title: tag.metaData.name,
      ...templateData,
    });
  });
};
