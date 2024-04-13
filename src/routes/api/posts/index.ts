import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';

export default async (app: FastifyInstance) => {
  type PostsRequest = FastifyRequest<{ Querystring: { page?: number; numberOfPosts?: number } }>;
  app.get('/', async (req: PostsRequest, reply: FastifyReply) => {
    const blogPostIndex = new BlogPostIndex(req.query.page, req.query.numberOfPosts);
    const posts = await blogPostIndex.getAllPosts();
    return reply.send(posts);
  });
};
