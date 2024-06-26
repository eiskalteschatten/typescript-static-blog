import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';
import Tag from '@/blog/Tag';

export default async (app: FastifyInstance) => {
  type TagRequest = FastifyRequest<{ Params: { tagSlug: string }; Querystring: { page?: number } }>;
  app.get('/:tagSlug', async (req: TagRequest, reply: FastifyReply) => {
    const { tagSlug } = req.params;
    const tag = new Tag(tagSlug);
    await tag.getTagMetaData();

    if (!tag.metaData) {
      return reply.callNotFound();
    }

    const blogPostIndex = new BlogPostIndex(req.query.page);
    await blogPostIndex.getPostsByTag(tagSlug);
    const templateData = await blogPostIndex.getTemplateData();

    return reply.render('_blog/index.ejs', req, {
      title: tag.metaData.name,
      mainNavId: tag.metaData.slug,
      ...templateData,
    });
  });
};
