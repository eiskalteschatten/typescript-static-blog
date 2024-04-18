import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';
import Author from '@/blog/Author';

export default async (app: FastifyInstance) => {
  type AuthorRequest = FastifyRequest<{ Params: { authorId: string }; Querystring: { page?: number } }>;
  app.get('/:authorId', async (req: AuthorRequest, reply: FastifyReply) => {
    const { authorId } = req.params;
    const author = new Author(authorId);

    if (!author.metaData) {
      return reply.callNotFound();
    }

    const blogPostIndex = new BlogPostIndex(req.query.page);
    await blogPostIndex.getPostsByAuthor(authorId);
    const templateData = await blogPostIndex.getTemplateData();

    return reply.view('_blog/index.ejs', {
      title: author.metaData.name,
      author: author.metaData,
      ...templateData,
    });
  });
};
