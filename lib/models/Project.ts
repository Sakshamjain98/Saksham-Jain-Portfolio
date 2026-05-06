import mongoose, { Schema, type Model, type Types } from "mongoose";

/**
 * Project — one row per portfolio project (homepage tile + /projects/[slug] page).
 * The detail page is composed of multiple sections that admins can edit
 * independently, so the document is structured as a header + ordered sections.
 */

export type ProjectStatus = "live" | "in-development" | "private";

export interface ProjectSection {
  kind: "overview" | "problem" | "architecture" | "stack" | "scaling" | "challenges" | "outcomes" | "custom";
  heading: string;
  body: string; // MDX-compatible markdown
  order: number;
}

export interface ProjectDoc {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  liveUrl?: string;
  repoUrl?: string;
  coverImage?: string;
  iconLists: string[];
  status: ProjectStatus;
  isFeatured: boolean;
  order: number;
  technologies: string[];
  sections: ProjectSection[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSectionSchema = new Schema<ProjectSection>(
  {
    kind: {
      type: String,
      enum: ["overview", "problem", "architecture", "stack", "scaling", "challenges", "outcomes", "custom"],
      required: true,
    },
    heading: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const ProjectSchema = new Schema<ProjectDoc>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true, maxlength: 240 },
    description: { type: String, required: true, trim: true },
    liveUrl: { type: String, trim: true },
    repoUrl: { type: String, trim: true },
    coverImage: { type: String, trim: true },
    iconLists: { type: [String], default: [] },
    status: { type: String, enum: ["live", "in-development", "private"], default: "live" },
    isFeatured: { type: Boolean, default: true },
    order: { type: Number, default: 0, index: true },
    technologies: { type: [String], default: [] },
    sections: { type: [ProjectSectionSchema], default: [] },
    publishedAt: { type: Date },
  },
  { timestamps: true, collection: "projects" },
);

ProjectSchema.index({ status: 1, order: 1 });

export const Project: Model<ProjectDoc> =
  (mongoose.models.Project as Model<ProjectDoc>) ||
  mongoose.model<ProjectDoc>("Project", ProjectSchema);
