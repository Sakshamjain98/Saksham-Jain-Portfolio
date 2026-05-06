import { getServerSession, type Session } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions, isAdminRole } from "./options";

export async function getSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}

/**
 * Server-side guard for admin pages. Redirects to /admin/login when not
 * authorized. Returns the session for use in the rendered page.
 */
export async function requireAdmin(): Promise<Session> {
  const session = await getSession();
  if (!session || !isAdminRole(session.user?.role)) {
    redirect("/admin/login");
  }
  return session;
}

export async function requireRole(roles: Array<"admin" | "editor" | "viewer">): Promise<Session> {
  const session = await getSession();
  const role = session?.user?.role;
  if (!session || !role || !roles.includes(role)) {
    redirect("/admin/login");
  }
  return session;
}
