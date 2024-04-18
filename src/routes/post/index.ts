import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import Sidebar from '@/components/Sidebar';
import BlogPost from '@/blog/BlogPost';
import Categories from '@/blog/Categories';
import Tags from '@/blog/Tags';

export default async (app: FastifyInstance) => {
  type PostRequest = FastifyRequest<{ Params: { postId: string } }>;
  app.get('/:postId', async (req: PostRequest, reply: FastifyReply) => {
    const { postId } = req.params;
    const blogPost = new BlogPost(postId);
    await blogPost.getPost();

    if (
      (!blogPost.metaData
        || blogPost.parsedBody === undefined
        || new Date(blogPost.metaData.publishedDate) > new Date()
        || blogPost.metaData.status !== 'published')
      && process.env.NODE_ENV !== 'development'
    ) {
      return reply.callNotFound();
    }

    const sidebarData = await Sidebar.getGenericSidebarData();
    const postCategories = Categories.getCategoriesByIds(blogPost.metaData.categories);
    const postTags = await Tags.getTagsByName(blogPost.metaData.tags);

    return reply.view('_blog/post.ejs', {
      title: blogPost.metaData.title,
      mainNavId: blogPost.metaData.id,
      body: blogPost.parsedBody,
      metaData: blogPost.metaData,
      authors: blogPost.authors,
      postCategories,
      postTags,
      metaDescription: blogPost.metaData.metaDescription,
      metaKeywords: [...postTags.map(tag => tag.name), ...postCategories.map(category => category.name)],
      ogImage: blogPost.metaData.titleImage,
      ogUrl: `/blog/post/${blogPost.metaData.id}/`,
      articlePublishedTime: blogPost.metaData.publishedDate,
      articleModifiedTime: blogPost.metaData.updatedAt,
      ...sidebarData,
    });
  });
};
