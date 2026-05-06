import Link from "next/link";
import { format } from "date-fns";

import { dbConnectSafe } from "@/lib/db/connect";
import { Project, BlogPost, Experience, Lead, Resume } from "@/lib/models";
import { getAllLeads, leadCounts } from "@/lib/cms/leads";
import { AdminPageHeader, StatCard } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

async function getCounts() {
  const conn = await dbConnectSafe();
  if (!conn) {
    return { projects: 0, posts: 0, drafts: 0, experience: 0, leads: 0, resumes: 0 };
  }
  const [projects, posts, drafts, experience, leads, resumes] = await Promise.all([
    Project.estimatedDocumentCount(),
    BlogPost.countDocuments({ status: "published" }),
    BlogPost.countDocuments({ status: "draft" }),
    Experience.estimatedDocumentCount(),
    Lead.countDocuments({ status: { $ne: "spam" } }),
    Resume.estimatedDocumentCount(),
  ]);
  return { projects, posts, drafts, experience, leads, resumes };
}

export default async function AdminDashboardPage() {
  const [counts, statusCounts, recentLeads] = await Promise.all([
    getCounts(),
    leadCounts(),
    getAllLeads({ limit: 5 }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Quick view of the things that matter."
      />

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-10">
        <StatCard label="Projects" value={counts.projects} />
        <StatCard label="Posts" value={counts.posts} hint={`${counts.drafts} draft${counts.drafts === 1 ? "" : "s"}`} />
        <StatCard label="Experience" value={counts.experience} />
        <StatCard label="Leads" value={counts.leads} hint={`${statusCounts.new} new`} />
        <StatCard label="Resumes" value={counts.resumes} />
        <StatCard
          label="Spam blocked"
          value={statusCounts.spam}
          hint="Honeypot + status filter"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Recent leads</h2>
            <Link
              href="/admin/leads"
              className="text-xs text-purple hover:underline"
            >
              View all →
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-white-200">No leads yet.</p>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="flex items-center justify-between hover:bg-white/[0.02] -mx-2 px-2 py-1.5 rounded-md transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {lead.firstName} {lead.lastName}
                      </p>
                      <p className="text-xs text-white-200 truncate">
                        {lead.email} — {lead.message.slice(0, 80)}
                        {lead.message.length > 80 ? "…" : ""}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 ml-3 text-[0.65rem] uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                        lead.status === "new"
                          ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                          : "border-white/10 text-white-200"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-6">
          <h2 className="text-lg font-semibold mb-4">Quick actions</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/admin/projects/new" className="text-purple hover:underline">
                + New project
              </Link>
            </li>
            <li>
              <Link href="/admin/blog/new" className="text-purple hover:underline">
                + New blog post
              </Link>
            </li>
            <li>
              <Link href="/admin/experience/new" className="text-purple hover:underline">
                + Add experience entry
              </Link>
            </li>
            <li>
              <Link href="/admin/resume" className="text-purple hover:underline">
                ⤴ Upload new resume PDF
              </Link>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <p className="text-[0.65rem] uppercase tracking-widest text-white-200">
              System
            </p>
            <p className="text-xs text-white-100 mt-1.5">
              Logged in as <span className="text-white">{`${counts.posts ? "" : ""}`}</span>
            </p>
            <p className="text-xs text-white-200 mt-1">
              Last build: {format(new Date(), "MMM d, yyyy HH:mm")}
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
