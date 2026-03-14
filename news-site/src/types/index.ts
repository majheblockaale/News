export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  author: Author;
  category: Category;
  tags: Tag[];
  status: "draft" | "review" | "published" | "archived";
  isFeatured: boolean;
  isBreaking: boolean;
  isEvergreen: boolean;
  sourceUrl?: string;
  sourceName?: string;
  readingTimeMinutes: number;
  wordCount: number;
  viewCount: number;
  shareCount: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  faq?: { question: string; answer: string }[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  parentId?: string;
  icon?: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  children?: Category[];
}

export interface Author {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "author" | "subscriber";
  avatarUrl?: string;
  bio?: string;
  socialLinks?: SocialLinks;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  website?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  parentId?: string;
  content: string;
  isApproved: boolean;
  likesCount: number;
  createdAt: string;
  user?: Author;
  replies?: Comment[];
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  categories: string[];
  frequency: "daily" | "weekly" | "breaking_only";
  isVerified: boolean;
  subscribedAt: string;
}
