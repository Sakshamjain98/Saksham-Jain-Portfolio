import mongoose, { Schema, type Model, type Types } from "mongoose";

/**
 * Resume — single-active-row design. Admins upload PDFs; the active one is
 * what /api/resume returns and what the public site links to.
 *
 * Storage: PDF binary in BSON Buffer. BSON max document size is 16MB; resumes
 * are typically <2MB, so this is fine. Larger files would justify GridFS or
 * a blob store (Vercel Blob / S3); not needed yet.
 */

export interface ResumeDoc {
  _id: Types.ObjectId;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
  isActive: boolean;
  uploadedByEmail: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<ResumeDoc>(
  {
    filename: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, default: "application/pdf" },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
    isActive: { type: Boolean, default: false, index: true },
    uploadedByEmail: { type: String, required: true, lowercase: true, trim: true },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true, collection: "resumes" },
);

ResumeSchema.index({ isActive: 1, createdAt: -1 });

// Ensure only one active resume at a time. When marking active, the API layer
// also updates other rows; this index helps the lookup.

export const Resume: Model<ResumeDoc> =
  (mongoose.models.Resume as Model<ResumeDoc>) ||
  mongoose.model<ResumeDoc>("Resume", ResumeSchema);
