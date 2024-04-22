import BlogPostIndex from '@/blog/BlogPostIndex';
import Categories from '@/blog/Categories';
import Tags from '@/blog/Tags';
import { BlogPostMetaData } from '@/interfaces/blog.interface';

export default class Sidebar {
  static async getGenericSidebarData(showLatestPosts = true) {
    const tags = await Tags.getAllTags();
    let latestPosts: BlogPostMetaData[];

    if (showLatestPosts) {
      const blogPostIndex = new BlogPostIndex(1, 5);
      latestPosts = await blogPostIndex.getAllPosts();
    }

    return {
      categories: Categories.getSorted(),
      tags,
      ...showLatestPosts && {
        latestPosts,
      },
    };
  }
}
