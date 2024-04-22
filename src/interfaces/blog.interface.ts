import { AuthorMetaData } from './author.interface';

export interface BlogPostPublishData {
  id: string;
  status: 'draft' | 'published';
  publishedDate: string;
}

export interface BlogPostMetaData extends BlogPostPublishData {
  title: string;
  authors: string[];
  titleImage: string;
  excerpt: string;
  categories: string[];
  tags?: string[];
  updatedAt: string;
  metaDescription: string;
  scheduled?: boolean;
}

export interface BlogPost {
  metaData: BlogPostMetaData;
  body: string;
  parsedBody: string;
  authors: AuthorMetaData[];
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
}
