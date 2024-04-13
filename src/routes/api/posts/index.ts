import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';

export default async (app: FastifyInstance) => {
  type PostsRequest = FastifyRequest<{ Querystring: { page?: number; postsPerPage?: number } }>;
  app.get('/', async (req: PostsRequest, reply: FastifyReply) => {
    const postsPerPage = req.query.postsPerPage ? Number(req.query.postsPerPage) + 1 : undefined;
    const blogPostIndex = new BlogPostIndex(req.query.page, postsPerPage);
    const posts = await blogPostIndex.getAllPosts();
    return reply.send(posts);
  });
};
