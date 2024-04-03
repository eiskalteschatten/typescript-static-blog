import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import Sidebar from '@/components/Sidebar';
import Categories from '@/blog/Categories';
import { CategoryMetaData } from '@/interfaces/category.interface';
import { BlogPostMetaData } from '@/interfaces/blog.interface';
import Category from '@/blog/Category';
import BlogPost from '@/blog/BlogPost';

interface PostForCategory {
  category: CategoryMetaData;
  posts: BlogPostMetaData[];
}

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const sidebarData = await Sidebar.getGenericSidebarData();
    const categories = Categories.getSorted();
    const postsForCategories: PostForCategory[] = [];

    for (const categoryMetaData of categories) {
      const category = new Category(categoryMetaData.id);
      const postIds = await category.getFirstThreePosts();
      const posts: BlogPostMetaData[] = [];

      for (const postId of postIds) {
        const blogPost = new BlogPost(postId);
        const metadata = await blogPost.getMetaData();
        posts.push(metadata);
      }

      postsForCategories.push({
        category: categoryMetaData,
        posts,
      });
    }

    return reply.view('categories.ejs', {
      title: 'Categories',
      mainNavId: 'categories',
      postsForCategories,
      ...sidebarData,
    });
  });
};
