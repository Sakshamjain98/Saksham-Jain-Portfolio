import { dbConnectSafe } from "@/lib/db/connect";
import { Lead } from "@/lib/models";
import type { LeadView } from "./types";

function dbToView(row: any): LeadView {
  return {
    id: row._id.toString(),
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    message: row.message,
    source: row.source,
    status: row.status,
    priority: row.priority,
    category: row.category,
    notes: (row.notes ?? []).map((n: any) => ({
      body: n.body,
      author: n.author,
      createdAt: new Date(n.createdAt).toISOString(),
    })),
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

export async function getAllLeads(opts?: {
  status?: LeadView["status"];
  limit?: number;
}): Promise<LeadView[]> {
  const conn = await dbConnectSafe();
  if (!conn) return [];
  try {
    const filter: Record<string, unknown> = {};
    if (opts?.status) filter.status = opts.status;
    const rows = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .limit(opts?.limit ?? 200)
      .lean();
    return rows.map(dbToView);
  } catch {
    return [];
  }
}

export async function getLeadById(id: string): Promise<LeadView | null> {
  const conn = await dbConnectSafe();
  if (!conn) return null;
  try {
    const row = await Lead.findById(id).lean();
    return row ? dbToView(row) : null;
  } catch {
    return null;
  }
}

export async function leadCounts(): Promise<Record<LeadView["status"], number>> {
  const empty = { new: 0, contacted: 0, qualified: 0, won: 0, archived: 0, spam: 0 } as Record<
    LeadView["status"],
    number
  >;
  const conn = await dbConnectSafe();
  if (!conn) return empty;
  try {
    const rows = await Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    for (const r of rows) {
      empty[r._id as LeadView["status"]] = r.count as number;
    }
    return empty;
  } catch {
    return empty;
  }
}
