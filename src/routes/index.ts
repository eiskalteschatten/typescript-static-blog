import { FastifyInstance, FastifyRequest } from 'fastify';

import BlogPostIndex from '@/blog/BlogPostIndex';
import Sidebar from '@/components/Sidebar';
import { FastifyReplyWithView } from '@/interfaces/fastify.interface';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReplyWithView) => {
    const blogPostIndex = new BlogPostIndex();
    await blogPostIndex.getAllPosts();

    const latestTwoPosts = blogPostIndex.getPostsAsItemTileItems(blogPostIndex.posts.slice(0, 2));
    const leftoverPosts = blogPostIndex.getPostsAsItemTileItems(blogPostIndex.posts.slice(2));

    const sidebarData = await Sidebar.getGenericSidebarData(false);

    return reply.render('home.ejs', {
      req,
      pageData: {
        mainNavId: 'home',
        latestTwoPosts,
        leftoverPosts,
        ...sidebarData,
      },
    });
  });
};
