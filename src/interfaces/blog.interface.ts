import { AuthorMetaData } from './author.interface';

export interface BlogPostMetaData {
  id: string;
  title: string;
  status: 'draft' | 'published';
  authors: string[];
  titleImage: string;
  excerpt: string;
  categories: string[];
  tags?: string[];
  publishedDate: string;
  updatedAt: string;
  metaDescription: string;
}

export interface BlogPost {
  metaData: BlogPostMetaData;
  body: string;
  parsedBody: string;
  authors: AuthorMetaData[];
}

export interface WordPressPost {
  id: number;
  jetpack_featured_media_url: string;
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  modified: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
}
