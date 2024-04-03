import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import Sidebar from '@/components/Sidebar';
import BlogPost from '@/blog/BlogPost';
import Categories from '@/blog/Categories';
import Tags from '@/blog/Tags';

export default async (app: FastifyInstance) => {
  type PostsRequest = FastifyRequest<{ Params: { postId: string } }>;
  app.get('/:postId', async (req: PostsRequest, reply: FastifyReply) => {
    const { postId } = req.params;
    const blogPost = new BlogPost(postId);
    await blogPost.getPost();

    if (!blogPost.metaData || !blogPost.parsedBody) {
      return reply.callNotFound();
    }

    const sidebarData = await Sidebar.getGenericSidebarData();
    const postCategories = Categories.getCategoriesByIds(blogPost.metaData.categories);
    const postTags = await Tags.getTagsByName(blogPost.metaData.tags);

    return reply.view('_blog/post.ejs', {
      title: blogPost.metaData.title,
      body: blogPost.parsedBody,
      metaData: blogPost.metaData,
      postCategories,
      postTags,
      ...sidebarData,
    });
  });
};
