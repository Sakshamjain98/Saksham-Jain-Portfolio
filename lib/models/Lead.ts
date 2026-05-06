import mongoose, { Schema, type Model, type Types } from "mongoose";

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "archived" | "spam";
export type LeadPriority = "low" | "medium" | "high";

export interface LeadNote {
  body: string;
  author: string; // admin email
  createdAt: Date;
}

export interface LeadDoc {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  source?: string; // e.g., "homepage-form", "blog-cta"
  status: LeadStatus;
  priority: LeadPriority;
  category?: string;
  ip?: string;
  userAgent?: string;
  notes: LeadNote[];
  createdAt: Date;
  updatedAt: Date;
}

const LeadNoteSchema = new Schema<LeadNote>(
  {
    body: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const LeadSchema = new Schema<LeadDoc>(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    source: { type: String, default: "homepage-form" },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "won", "archived", "spam"],
      default: "new",
      index: true,
    },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    category: { type: String, trim: true },
    ip: { type: String },
    userAgent: { type: String },
    notes: { type: [LeadNoteSchema], default: [] },
  },
  { timestamps: true, collection: "leads" },
);

LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1, createdAt: -1 });

export const Lead: Model<LeadDoc> =
  (mongoose.models.Lead as Model<LeadDoc>) ||
  mongoose.model<LeadDoc>("Lead", LeadSchema);
