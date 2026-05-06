import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function NewBlogPostPage() {
  const session = await requireAdmin();
  return (
    <>
      <AdminPageHeader
        title="New blog post"
        subtitle="Write in MDX. Save as draft until you're ready to publish."
        action={
          <Link href="/admin/blog" className="text-sm text-white-200 hover:text-white">
            ← Back
          </Link>
        }
      />
      <BlogForm
        mode={{ kind: "create" }}
        defaultAuthorEmail={session.user.email!}
        defaultAuthorName={session.user.name ?? undefined}
      />
    </>
  );
}
