import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import { getLeadById } from "@/lib/cms/leads";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { LeadStatusControls } from "@/components/admin/LeadStatusControls";
import { LeadNoteForm } from "@/components/admin/LeadNoteForm";
import { DeleteConfirmForm } from "@/components/admin/DeleteConfirmForm";
import { deleteLeadAction } from "@/lib/actions/leads";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await getLeadById(params.id);
  if (!lead) notFound();

  async function deleteLead() {
    "use server";
    await deleteLeadAction(params.id);
  }

  return (
    <>
      <AdminPageHeader
        title={`${lead.firstName} ${lead.lastName}`}
        subtitle={lead.email}
        action={
          <Link href="/admin/leads" className="text-sm text-white-200 hover:text-white">
            ← Back
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          <article className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-6">
            <p className="text-[0.65rem] uppercase tracking-widest text-white-200 mb-3">
              Message · {format(new Date(lead.createdAt), "MMM d, yyyy 'at' HH:mm")}
            </p>
            <p className="text-white-100 leading-relaxed whitespace-pre-line">
              {lead.message}
            </p>
            <div className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-white-200 grid gap-1 grid-cols-2">
              <p>Source: <span className="text-white-100">{lead.source ?? "—"}</span></p>
              <p>Category: <span className="text-white-100">{lead.category ?? "—"}</span></p>
            </div>
          </article>

          <article className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-6">
            <h3 className="text-sm uppercase tracking-widest text-white-200 mb-4">Notes</h3>
            {lead.notes.length === 0 ? (
              <p className="text-sm text-white-200 mb-5">No notes yet.</p>
            ) : (
              <ul className="space-y-4 mb-6">
                {lead.notes
                  .slice()
                  .reverse()
                  .map((n, i) => (
                    <li key={i} className="border-l-2 border-purple/40 pl-4">
                      <p className="text-white-100 text-sm whitespace-pre-line">{n.body}</p>
                      <p className="text-[0.65rem] text-white-200 mt-1">
                        {n.author} · {format(new Date(n.createdAt), "MMM d, HH:mm")}
                      </p>
                    </li>
                  ))}
              </ul>
            )}
            <LeadNoteForm leadId={lead.id} />
          </article>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-6">
            <h3 className="text-sm uppercase tracking-widest text-white-200 mb-4">Triage</h3>
            <LeadStatusControls id={lead.id} status={lead.status} priority={lead.priority} />
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-6">
            <h3 className="text-sm uppercase tracking-widest text-white-200 mb-4">Quick reply</h3>
            <a
              href={`mailto:${lead.email}?subject=Re: your inquiry`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium hover:border-white/40 transition-colors"
            >
              Email {lead.firstName}
            </a>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <h3 className="text-sm uppercase tracking-widest text-red-300 mb-4">Danger zone</h3>
            <DeleteConfirmForm
              action={deleteLead}
              label="Delete lead"
              confirmMessage="Delete this lead and all notes permanently?"
            />
          </div>
        </aside>
      </div>
    </>
  );
}
