import { dbConnectSafe } from "@/lib/db/connect";
import { Resume } from "@/lib/models";

export interface ResumeMetaView {
  id: string;
  filename: string;
  size: number;
  isActive: boolean;
  uploadedByEmail: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export async function listResumes(): Promise<ResumeMetaView[]> {
  const conn = await dbConnectSafe();
  if (!conn) return [];
  try {
    const rows = await Resume.find({}, { data: 0 })
      .sort({ createdAt: -1 })
      .lean();
    return rows.map((r: any) => ({
      id: r._id.toString(),
      filename: r.filename,
      size: r.size,
      isActive: r.isActive,
      uploadedByEmail: r.uploadedByEmail,
      notes: r.notes,
      createdAt: new Date(r.createdAt).toISOString(),
      updatedAt: new Date(r.updatedAt).toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function getActiveResumeMeta(): Promise<ResumeMetaView | null> {
  const conn = await dbConnectSafe();
  if (!conn) return null;
  try {
    const r: any = await Resume.findOne({ isActive: true }, { data: 0 }).lean();
    if (!r) return null;
    return {
      id: r._id.toString(),
      filename: r.filename,
      size: r.size,
      isActive: r.isActive,
      uploadedByEmail: r.uploadedByEmail,
      notes: r.notes,
      createdAt: new Date(r.createdAt).toISOString(),
      updatedAt: new Date(r.updatedAt).toISOString(),
    };
  } catch {
    return null;
  }
}

export async function getActiveResumeBinary(): Promise<{
  filename: string;
  data: Buffer;
  mimeType: string;
} | null> {
  const conn = await dbConnectSafe();
  if (!conn) return null;
  try {
    const r: any = await Resume.findOne({ isActive: true }).lean();
    if (!r) return null;
    return {
      filename: r.filename,
      data: r.data,
      mimeType: r.mimeType ?? "application/pdf",
    };
  } catch {
    return null;
  }
}
