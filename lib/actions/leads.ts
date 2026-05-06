"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dbConnect } from "@/lib/db/connect";
import { Lead } from "@/lib/models";
import { leadStatusSchema, leadPrioritySchema, leadNoteSchema } from "@/lib/validations/lead";
import { requireAdmin } from "@/lib/auth/session";

export async function updateLeadStatusAction(id: string, status: string) {
  await requireAdmin();
  const parsed = leadStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false as const, error: "Invalid status" };
  await dbConnect();
  await Lead.findByIdAndUpdate(id, { status: parsed.data });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  return { ok: true as const };
}

export async function updateLeadPriorityAction(id: string, priority: string) {
  await requireAdmin();
  const parsed = leadPrioritySchema.safeParse(priority);
  if (!parsed.success) return { ok: false as const, error: "Invalid priority" };
  await dbConnect();
  await Lead.findByIdAndUpdate(id, { priority: parsed.data });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  return { ok: true as const };
}

export async function addLeadNoteAction(id: string, _: unknown, formData: FormData) {
  const session = await requireAdmin();
  const parsed = leadNoteSchema.safeParse({ body: String(formData.get("body") ?? "") });
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message };

  await dbConnect();
  await Lead.findByIdAndUpdate(id, {
    $push: {
      notes: {
        body: parsed.data.body,
        author: session.user.email ?? "admin",
        createdAt: new Date(),
      },
    },
  });
  revalidatePath(`/admin/leads/${id}`);
  return { ok: true as const };
}

export async function deleteLeadAction(id: string) {
  await requireAdmin();
  await dbConnect();
  await Lead.findByIdAndDelete(id);
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}
