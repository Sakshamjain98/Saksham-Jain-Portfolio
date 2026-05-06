"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dbConnect } from "@/lib/db/connect";
import { Project } from "@/lib/models";
import { projectInputSchema } from "@/lib/validations/project";
import { requireAdmin } from "@/lib/auth/session";

function parseFromFormData(fd: FormData) {
  return {
    slug: String(fd.get("slug") ?? ""),
    title: String(fd.get("title") ?? ""),
    tagline: String(fd.get("tagline") ?? ""),
    description: String(fd.get("description") ?? ""),
    liveUrl: String(fd.get("liveUrl") ?? ""),
    repoUrl: String(fd.get("repoUrl") ?? ""),
    coverImage: String(fd.get("coverImage") ?? ""),
    iconLists: String(fd.get("iconLists") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    technologies: String(fd.get("technologies") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    status: (String(fd.get("status") ?? "live") as "live" | "in-development" | "private"),
    isFeatured: fd.get("isFeatured") === "on" || fd.get("isFeatured") === "true",
    order: Number(fd.get("order") ?? 0),
    sections: parseSections(fd),
  };
}

function parseSections(fd: FormData) {
  // Sections are submitted as JSON in a hidden field for simplicity.
  const raw = fd.get("sectionsJson");
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const arr = JSON.parse(raw) as Array<{
      kind: string;
      heading: string;
      body: string;
      order?: number;
    }>;
    return arr.map((s, i) => ({
      kind: (s.kind ?? "custom") as
        | "overview"
        | "problem"
        | "architecture"
        | "stack"
        | "scaling"
        | "challenges"
        | "outcomes"
        | "custom",
      heading: s.heading ?? "",
      body: s.body ?? "",
      order: s.order ?? i,
    }));
  } catch {
    return [];
  }
}

export async function createProjectAction(_: unknown, formData: FormData) {
  await requireAdmin();
  await dbConnect();

  const parsed = projectInputSchema.safeParse(parseFromFormData(formData));
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const exists = await Project.findOne({ slug: parsed.data.slug });
  if (exists) {
    return { ok: false as const, error: `Slug "${parsed.data.slug}" already exists` };
  }

  await Project.create(parsed.data);
  revalidatePath("/projects");
  revalidatePath(`/projects/${parsed.data.slug}`);
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProjectAction(id: string, _: unknown, formData: FormData) {
  await requireAdmin();
  await dbConnect();

  const parsed = projectInputSchema.safeParse(parseFromFormData(formData));
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const updated = await Project.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!updated) {
    return { ok: false as const, error: "Project not found" };
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${updated.slug}`);
  revalidatePath("/admin/projects");
  return { ok: true as const };
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await dbConnect();
  const removed = await Project.findByIdAndDelete(id);
  if (removed) {
    revalidatePath("/projects");
    revalidatePath(`/projects/${removed.slug}`);
    revalidatePath("/admin/projects");
  }
  redirect("/admin/projects");
}
