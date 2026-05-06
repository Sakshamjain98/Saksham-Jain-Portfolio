import { format } from "date-fns";

import { listResumes } from "@/lib/cms/resume";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ResumeUploader } from "@/components/admin/ResumeUploader";
import { ResumeRowActions } from "@/components/admin/ResumeRowActions";

export const dynamic = "force-dynamic";

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminResumePage() {
  const resumes = await listResumes();

  return (
    <>
      <AdminPageHeader
        title="Resume"
        subtitle="Upload a new PDF; mark it active to serve from /api/resume."
      />

      <section className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-6 mb-10">
        <h2 className="text-sm uppercase tracking-widest text-white-200 mb-5">
          Upload new version
        </h2>
        <ResumeUploader />
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-widest text-white-200 mb-4">
          Version history
        </h2>
        {resumes.length === 0 ? (
          <p className="text-white-200 text-sm">No resume uploaded yet.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black-200/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-[0.65rem] uppercase tracking-widest text-white-200">
                  <th className="text-left px-4 py-3 font-medium">File</th>
                  <th className="text-left px-4 py-3 font-medium">Size</th>
                  <th className="text-left px-4 py-3 font-medium">Uploaded</th>
                  <th className="text-left px-4 py-3 font-medium">By</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((r) => (
                  <tr key={r.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="px-4 py-3 text-white">{r.filename}</td>
                    <td className="px-4 py-3 text-white-200 text-xs">{fmtBytes(r.size)}</td>
                    <td className="px-4 py-3 text-white-200 text-xs">
                      {format(new Date(r.createdAt), "MMM d, yyyy HH:mm")}
                    </td>
                    <td className="px-4 py-3 text-white-200 text-xs">{r.uploadedByEmail}</td>
                    <td className="px-4 py-3">
                      {r.isActive ? (
                        <span className="inline-block text-[0.65rem] uppercase tracking-widest px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                          Active
                        </span>
                      ) : (
                        <span className="text-[0.65rem] uppercase tracking-widest text-white-200">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ResumeRowActions id={r.id} isActive={r.isActive} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
