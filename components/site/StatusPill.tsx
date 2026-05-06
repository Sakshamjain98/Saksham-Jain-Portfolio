import type { ProjectStatusView } from "@/lib/cms/types";

const styles: Record<ProjectStatusView, string> = {
  live: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  "in-development": "border-amber-500/40 bg-amber-500/10 text-amber-300",
  private: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
};

const labels: Record<ProjectStatusView, string> = {
  live: "Live",
  "in-development": "In Development",
  private: "Private",
};

export function StatusPill({ status }: { status: ProjectStatusView }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}
