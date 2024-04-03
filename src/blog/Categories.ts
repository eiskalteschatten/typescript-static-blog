import categories from '@data/categories.json';

import { CategoryMetaData } from '@/interfaces/category.interface';

export default class Categories {
  static getSorted(): CategoryMetaData[] {
    return categories.sort((a, b) => a.name.localeCompare(b.name));
  }

  static getCategoriesByIds(ids: string[]): CategoryMetaData[] | undefined {
    return categories.filter(category => ids.includes(category.id));
  }
}
