import { requireAdmin } from "@/lib/auth/session";
import { AdminProviders } from "@/components/admin/Providers";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <AdminProviders>
      <AdminShell
        user={{
          name: session.user?.name,
          email: session.user?.email,
          role: session.user?.role,
        }}
      >
        {children}
      </AdminShell>
    </AdminProviders>
  );
}
