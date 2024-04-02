import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { getAllBlogPostMetaData } from '@/blog/utils';
import { ItemTileItem } from '@/interfaces/itemTile.interface';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const postMetaData = await getAllBlogPostMetaData();
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
