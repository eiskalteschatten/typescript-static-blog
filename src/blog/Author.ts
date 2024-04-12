import authors from '@data/authors.json';

import { AuthorMetaData } from '@/interfaces/author.interface';

export default class Author {
  metaData: AuthorMetaData;

  constructor(public authorId: string) {}

  getAuthorMetaData(): AuthorMetaData {
    this.metaData = authors.find(author => author.id === this.authorId);
    return this.metaData;
  }
}
