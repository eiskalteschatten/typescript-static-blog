import categories from '@data/categories.json';

import { CategoryMetaData } from '@/interfaces/category.interface';

export default class Category {
  metaData: CategoryMetaData;

  constructor(private categoryId: string) {
    this.metaData = categories.find(category => category.id === this.categoryId);
  }
}
