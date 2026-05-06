import Link from "next/link";
import { format } from "date-fns";

import { getAllLeads, leadCounts } from "@/lib/cms/leads";
import type { LeadView } from "@/lib/cms/types";
import { AdminPageHeader, StatCard } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

const statusStyles: Record<LeadView["status"], string> = {
  new: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  contacted: "border-blue-100/40 bg-blue-100/10 text-blue-100",
  qualified: "border-purple/40 bg-purple/10 text-purple",
  won: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  archived: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  spam: "border-red-500/40 bg-red-500/10 text-red-300",
};

const VALID_STATUSES = ["new", "contacted", "qualified", "won", "archived", "spam"] as const;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const status = (VALID_STATUSES as readonly string[]).includes(searchParams?.status ?? "")
    ? (searchParams!.status as LeadView["status"])
    : undefined;

  const [leads, counts] = await Promise.all([
    getAllLeads({ status }),
    leadCounts(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Leads"
        subtitle="Inbound from the contact form."
      />

      <div className="grid gap-3 grid-cols-2 md:grid-cols-6 mb-6">
        <Link href="/admin/leads"><StatCard label="All" value={Object.values(counts).reduce((a, b) => a + b, 0)} /></Link>
        <Link href="/admin/leads?status=new"><StatCard label="New" value={counts.new} /></Link>
        <Link href="/admin/leads?status=contacted"><StatCard label="Contacted" value={counts.contacted} /></Link>
        <Link href="/admin/leads?status=qualified"><StatCard label="Qualified" value={counts.qualified} /></Link>
        <Link href="/admin/leads?status=won"><StatCard label="Won" value={counts.won} /></Link>
        <Link href="/admin/leads?status=spam"><StatCard label="Spam" value={counts.spam} /></Link>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-12 text-center">
          <p className="text-white-100">
            {status ? `No leads with status "${status}".` : "No leads yet."}
          </p>
          {status && (
            <Link href="/admin/leads" className="text-purple text-sm hover:underline mt-2 inline-block">
              Clear filter
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black-200/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[0.65rem] uppercase tracking-widest text-white-200">
                <th className="text-left px-4 py-3 font-medium">Lead</th>
                <th className="text-left px-4 py-3 font-medium">Message</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${lead.id}`} className="block">
                      <p className="text-white">
                        {lead.firstName} {lead.lastName}
                      </p>
                      <p className="text-xs text-white-200">{lead.email}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-white-100 text-xs max-w-[24rem] truncate">
                    {lead.message}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-[0.65rem] uppercase tracking-widest px-2 py-0.5 rounded-full border ${statusStyles[lead.status]}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white-200 text-xs">
                    {format(new Date(lead.createdAt), "MMM d, HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
