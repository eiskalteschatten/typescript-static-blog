export interface BlogPostMetaData {
  id: string;
  title: string;
  author: string;
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
