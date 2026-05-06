"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dbConnect } from "@/lib/db/connect";
import { Resume } from "@/lib/models";
import { RESUME_ALLOWED_MIME, RESUME_MAX_BYTES, resumeMetadataSchema } from "@/lib/validations/resume";
import { requireAdmin } from "@/lib/auth/session";

export async function uploadResumeAction(_: unknown, formData: FormData) {
  const session = await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false as const, error: "No file uploaded" };
  }
  if (!RESUME_ALLOWED_MIME.includes(file.type) && !file.name.toLowerCase().endsWith(".pdf")) {
    return { ok: false as const, error: "Only PDF files are accepted" };
  }
  if (file.size > RESUME_MAX_BYTES) {
    return {
      ok: false as const,
      error: `File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max ${(RESUME_MAX_BYTES / (1024 * 1024)).toFixed(0)}MB.`,
    };
  }

  const meta = resumeMetadataSchema.safeParse({
    filename: file.name,
    notes: String(formData.get("notes") ?? "") || undefined,
  });
  if (!meta.success) {
    return { ok: false as const, error: meta.error.issues[0]?.message ?? "Invalid metadata" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const setActiveOnUpload =
    formData.get("setActive") === "on" || formData.get("setActive") === "true";

  await dbConnect();

  if (setActiveOnUpload) {
    await Resume.updateMany({ isActive: true }, { isActive: false });
  }

  await Resume.create({
    filename: meta.data.filename,
    mimeType: file.type || "application/pdf",
    size: file.size,
    data: buffer,
    isActive: setActiveOnUpload,
    uploadedByEmail: session.user.email ?? "admin",
    notes: meta.data.notes,
  });

  revalidatePath("/resume");
  revalidatePath("/admin/resume");
  return { ok: true as const };
}

export async function setActiveResumeAction(id: string) {
  await requireAdmin();
  await dbConnect();
  await Resume.updateMany({ isActive: true }, { isActive: false });
  await Resume.findByIdAndUpdate(id, { isActive: true });
  revalidatePath("/resume");
  revalidatePath("/admin/resume");
  return { ok: true as const };
}

export async function deleteResumeAction(id: string) {
  await requireAdmin();
  await dbConnect();
  await Resume.findByIdAndDelete(id);
  revalidatePath("/resume");
  revalidatePath("/admin/resume");
  redirect("/admin/resume");
}
