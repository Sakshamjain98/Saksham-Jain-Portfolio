import mongoose, { Schema, type Model, type Types } from "mongoose";

export type BlogPostStatus = "draft" | "published" | "archived";

export interface BlogPostDoc {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  excerpt: string;
  contentMdx: string;
  coverImage?: string;
  tags: string[];
  category?: string;
  status: BlogPostStatus;
  authorEmail: string;
  authorName?: string;
  readingTimeMinutes: number;
  publishedAt?: Date | null;
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<BlogPostDoc>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 240 },
    excerpt: { type: String, required: true, trim: true, maxlength: 500 },
    contentMdx: { type: String, required: true },
    coverImage: { type: String, trim: true },
    tags: { type: [String], default: [], index: true },
    category: { type: String, trim: true, index: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    authorEmail: { type: String, required: true, lowercase: true, trim: true },
    authorName: { type: String, trim: true },
    readingTimeMinutes: { type: Number, default: 1 },
    publishedAt: { type: Date, default: null },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    ogImage: { type: String, trim: true },
  },
  { timestamps: true, collection: "blog_posts" },
);

BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ tags: 1, status: 1 });

export const BlogPost: Model<BlogPostDoc> =
  (mongoose.models.BlogPost as Model<BlogPostDoc>) ||
  mongoose.model<BlogPostDoc>("BlogPost", BlogPostSchema);
