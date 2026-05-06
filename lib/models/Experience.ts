import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface ExperienceDoc {
  _id: Types.ObjectId;
  title: string;
  company: string;
  description: string;
  location?: string;
  startDate: Date;
  endDate?: Date | null; // null => current
  order: number;
  thumbnail?: string;
  highlights: string[];
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<ExperienceDoc>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    order: { type: Number, default: 0, index: true },
    thumbnail: { type: String, trim: true },
    highlights: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
  },
  { timestamps: true, collection: "experience" },
);

ExperienceSchema.index({ startDate: -1 });

export const Experience: Model<ExperienceDoc> =
  (mongoose.models.Experience as Model<ExperienceDoc>) ||
  mongoose.model<ExperienceDoc>("Experience", ExperienceSchema);
