import Link from "next/link";
import { format } from "date-fns";

import { dbConnectSafe } from "@/lib/db/connect";
import { Experience } from "@/lib/models";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { PrimaryButton } from "@/components/admin/FormPrimitives";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const conn = await dbConnectSafe();
  const rows = conn
    ? await Experience.find({}).sort({ startDate: -1 }).lean()
    : [];

  return (
    <>
      <AdminPageHeader
        title="Experience"
        subtitle="Timeline shown on /resume."
        action={
          <Link href="/admin/experience/new">
            <PrimaryButton type="button">+ Add entry</PrimaryButton>
          </Link>
        }
      />

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-12 text-center">
          <p className="text-white-100">
            No experience rows yet — /resume is rendering from{" "}
            <code className="text-purple">data/index.ts</code>.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black-200/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[0.65rem] uppercase tracking-widest text-white-200">
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Company</th>
                <th className="text-left px-4 py-3 font-medium">Period</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r._id.toString()} className="border-b border-white/[0.04] last:border-0">
                  <td className="px-4 py-3 text-white">{r.title}</td>
                  <td className="px-4 py-3 text-white-100">{r.company}</td>
                  <td className="px-4 py-3 text-white-200 text-xs">
                    {format(new Date(r.startDate), "MMM yyyy")} —{" "}
                    {r.endDate ? format(new Date(r.endDate), "MMM yyyy") : "Present"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/experience/${r._id.toString()}`}
                      className="text-purple text-xs hover:underline"
                    >
                      Edit
                    </Link>
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
