"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dbConnect } from "@/lib/db/connect";
import { Experience } from "@/lib/models";
import { experienceInputSchema } from "@/lib/validations/experience";
import { requireAdmin } from "@/lib/auth/session";

function parseFromFormData(fd: FormData) {
  const endDateStr = String(fd.get("endDate") ?? "");
  return {
    title: String(fd.get("title") ?? ""),
    company: String(fd.get("company") ?? ""),
    description: String(fd.get("description") ?? ""),
    location: String(fd.get("location") ?? ""),
    startDate: String(fd.get("startDate") ?? ""),
    endDate: endDateStr ? endDateStr : null,
    order: Number(fd.get("order") ?? 0),
    thumbnail: String(fd.get("thumbnail") ?? ""),
    highlights: String(fd.get("highlights") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    technologies: String(fd.get("technologies") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export async function createExperienceAction(_: unknown, formData: FormData) {
  await requireAdmin();
  await dbConnect();
  const parsed = experienceInputSchema.safeParse(parseFromFormData(formData));
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  await Experience.create(parsed.data);
  revalidatePath("/resume");
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}

export async function updateExperienceAction(id: string, _: unknown, formData: FormData) {
  await requireAdmin();
  await dbConnect();
  const parsed = experienceInputSchema.safeParse(parseFromFormData(formData));
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const updated = await Experience.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!updated) return { ok: false as const, error: "Not found" };
  revalidatePath("/resume");
  revalidatePath("/admin/experience");
  return { ok: true as const };
}

export async function deleteExperienceAction(id: string) {
  await requireAdmin();
  await dbConnect();
  await Experience.findByIdAndDelete(id);
  revalidatePath("/resume");
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}
