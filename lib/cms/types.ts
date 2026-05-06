/**
 * Serializable view types passed from server components to client components.
 * Mongoose docs are not directly serializable (ObjectId, Date) — these are.
 */

export type ProjectStatusView = "live" | "in-development" | "private";

export interface ProjectSectionView {
  kind:
    | "overview"
    | "problem"
    | "architecture"
    | "stack"
    | "scaling"
    | "challenges"
    | "outcomes"
    | "custom";
  heading: string;
  body: string;
  order: number;
}

export interface ProjectView {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  liveUrl?: string;
  repoUrl?: string;
  coverImage?: string;
  iconLists: string[];
  status: ProjectStatusView;
  isFeatured: boolean;
  order: number;
  technologies: string[];
  sections: ProjectSectionView[];
  publishedAt?: string;
  updatedAt?: string;
}

export interface ExperienceView {
  id: string;
  title: string;
  company: string;
  description: string;
  location?: string;
  startDate: string; // ISO
  endDate?: string | null;
  order: number;
  thumbnail?: string;
  highlights: string[];
  technologies: string[];
}

export interface BlogPostView {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMdx: string;
  coverImage?: string;
  tags: string[];
  category?: string;
  status: "draft" | "published" | "archived";
  authorEmail: string;
  authorName?: string;
  readingTimeMinutes: number;
  publishedAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadView {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  source?: string;
  status: "new" | "contacted" | "qualified" | "won" | "archived" | "spam";
  priority: "low" | "medium" | "high";
  category?: string;
  notes: { body: string; author: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}
