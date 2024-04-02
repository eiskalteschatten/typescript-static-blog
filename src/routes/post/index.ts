import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import Sidebar from '@/components/Sidebar';
import BlogPost from '@/blog/BlogPost';

export default async (app: FastifyInstance) => {
  type PostsRequest = FastifyRequest<{ Params: { postId: string } }>;
  app.get('/:postId', async (req: PostsRequest, reply: FastifyReply) => {
    const { postId } = req.params;
    const blogPost = new BlogPost(postId);
    await blogPost.getPost();
    const sidebarData = await Sidebar.getGenericSidebarData();

    return reply.view('_blog/post.ejs', {
      title: blogPost.metaData.title,
      body: blogPost.parsedBody,
      metaData: blogPost.metaData,
      ...sidebarData,
    });
  });
};
