import Link from "next/link";

import { SubpageShell } from "@/components/site/SubpageShell";

export const metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <SubpageShell>
      <div className="text-center py-20">
        <p className="uppercase tracking-widest text-xs text-blue-100 mb-4">
          404
        </p>
        <h1 className="heading">
          That page <span className="text-purple">doesn&apos;t exist</span>
        </h1>
        <p className="text-white-200 mt-6 max-w-md mx-auto">
          You&apos;ve hit a route that isn&apos;t wired up. The portfolio still
          has plenty to show.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-purple text-black-100 px-5 py-2.5 text-sm font-semibold"
          >
            Go home
          </Link>
          <Link
            href="/projects"
            className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium hover:border-white/40 transition-colors"
          >
            See projects
          </Link>
        </div>
      </div>
    </SubpageShell>
  );
}
