import { redirect } from "next/navigation";
import Link from "next/link";

import { getSession } from "@/lib/auth/session";
import { isAdminRole } from "@/lib/auth/options";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Admin sign-in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string; forbidden?: string; verify?: string; error?: string };
}) {
  const session = await getSession();
  if (session && isAdminRole(session.user?.role)) {
    redirect(searchParams?.callbackUrl || "/admin");
  }

  const emailMagicLinkEnabled = !!(process.env.EMAIL_SERVER && process.env.EMAIL_FROM);

  return (
    <div className="min-h-screen bg-black-100 text-white flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 dark:bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]" />

      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <img src="/favicon.svg" alt="" className="w-10 h-10" />
        </Link>

        <div className="rounded-2xl border border-white/[0.08] bg-black-200/60 backdrop-blur p-7">
          <h1 className="text-2xl font-bold">Admin sign in</h1>
          <p className="text-sm text-white-200 mt-1.5">
            Sign in to manage projects, blog posts, leads, and your resume.
          </p>

          {searchParams?.forbidden && (
            <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-300">
              You don&apos;t have access to that area. Sign in with an admin account.
            </div>
          )}
          {searchParams?.verify && (
            <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              Check your email for a sign-in link.
            </div>
          )}
          {searchParams?.error && (
            <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
              Sign in failed. Check your credentials and try again.
            </div>
          )}

          <LoginForm
            emailMagicLinkEnabled={emailMagicLinkEnabled}
            callbackUrl={searchParams?.callbackUrl}
          />

          <p className="mt-7 text-[0.7rem] text-center text-white-200">
            <Link href="/" className="hover:text-white">
              ← Back to portfolio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
