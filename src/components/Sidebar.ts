import Categories from '@/blog/Categories';
import Tags from '@/blog/Tags';

export default class Sidebar {
  static async getGenericSidebarData() {
    const tags = await Tags.getAllTags();

    return {
      categories: Categories.getSorted(),
      tags,
    };
  }
}
