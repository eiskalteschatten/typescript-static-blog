import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import Sidebar from '@/components/Sidebar';
import Categories from '@/blog/Categories';
import { CategoryMetaData } from '@/interfaces/category.interface';
import Category from '@/blog/Category';
import BlogPost from '@/blog/BlogPost';
import { ItemTileItem } from '@/interfaces/itemTile.interface';

interface PostForCategory {
  category: CategoryMetaData;
  posts: ItemTileItem[];
}

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const sidebarData = await Sidebar.getGenericSidebarData();
    const categories = Categories.getSorted();
    const postsForCategories: PostForCategory[] = [];

    for (const categoryMetaData of categories) {
      const category = new Category(categoryMetaData.id);
      const cachedPosts = await category.getFirstThreePosts();
      const posts: ItemTileItem[] = [];

      for (const { id: postId } of cachedPosts) {
        const blogPost = new BlogPost(postId);
        await blogPost.getMetaData();
        posts.push(blogPost.getPostAsItemTileItems());
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
