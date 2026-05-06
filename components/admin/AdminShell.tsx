import Link from "next/link";

import { AdminNav } from "./AdminNav";
import { SignOutButton } from "./SignOutButton";

export function AdminShell({
  user,
  children,
}: {
  user: { name?: string | null; email?: string | null; role?: string };
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black-100 text-white">
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-white/[0.06] min-h-screen sticky top-0 self-start p-6">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <img src="/favicon.svg" alt="" className="w-8 h-8" />
            <div className="leading-tight">
              <p className="text-sm font-semibold">Saksham Jain</p>
              <p className="text-[0.65rem] uppercase tracking-widest text-white-200">
                Admin
              </p>
            </div>
          </Link>

          <AdminNav />

          <div className="mt-auto pt-6 border-t border-white/[0.06]">
            <p className="text-xs text-white-100 truncate">{user.name ?? user.email}</p>
            <p className="text-[0.65rem] uppercase tracking-widest text-purple mb-3">
              {user.role ?? "viewer"}
            </p>
            <SignOutButton />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="md:hidden flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <Link href="/admin" className="flex items-center gap-2">
              <img src="/favicon.svg" alt="" className="w-7 h-7" />
              <span className="text-sm font-semibold">Admin</span>
            </Link>
            <SignOutButton />
          </div>
          <div className="md:hidden border-b border-white/[0.06] p-3 overflow-x-auto">
            <AdminNav />
          </div>

          <div className="p-6 md:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

// ── Shared admin UI primitives ──────────────────────────────────────────────

export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-white-200 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black-200/40 p-5">
      <p className="text-[0.65rem] uppercase tracking-widest text-white-200">
        {label}
      </p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {hint && <p className="text-xs text-white-200 mt-2">{hint}</p>}
    </div>
  );
}
