import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { ItemTileItem } from '@/interfaces/itemTile.interface';
import BlogPostIndex from '@/blog/BlogPostIndex';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const blogPostIndex = new BlogPostIndex('allPosts');
    const postMetaData = await blogPostIndex.getPosts();

    const blogPosts: ItemTileItem[] = postMetaData ? postMetaData.map(post => ({
      id: post.id,
      title: post.title,
      description: post.excerpt,
      image: post.titleImage,
      link: `/post/${post.id}`,
    })) : [];

    return reply.view('all-posts/index.ejs', {
      title: 'All Posts',
      mainNavId: 'allPosts',
      blogPosts,
    });
  });
};
