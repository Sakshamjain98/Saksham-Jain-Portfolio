import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";

import { getPublishedPosts, getAllTags } from "@/lib/cms/blog";
import { SubpageShell } from "@/components/site/SubpageShell";
import { SectionHeader } from "@/components/site/SectionHeader";
import Footer from "@/components/Footer";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on system design, backend engineering, AI infrastructure, MongoDB, Next.js, and the architectural decisions behind shipped products.",
};

export default async function BlogIndexPage() {
  const [posts, tags] = await Promise.all([getPublishedPosts(), getAllTags()]);

  return (
    <SubpageShell>
      <SectionHeader
        eyebrow="Notes from the build"
        title={
          <>
            Engineering <span className="text-purple">in writing</span>
          </>
        }
        subtitle="System design, backend depth, MongoDB, Next.js, AI infrastructure, and what shipping production systems actually teaches you."
      />

      {tags.length > 0 && (
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="rounded-full border border-white/10 bg-black-200/40 px-3 py-1 text-xs text-white-100 hover:border-purple/40 transition-colors"
            >
              {tag}
              <span className="ml-1.5 text-white-200">{count}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-16 grid gap-6 md:gap-8">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-12 text-center">
            <p className="text-white-100 text-lg">No posts published yet.</p>
            <p className="text-white-200 text-sm mt-2">
              The first post drops once the admin panel is wired and a draft is
              promoted to <code className="text-purple">published</code>.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group grid gap-6 md:grid-cols-[1fr_2fr] rounded-2xl border border-white/[0.08] bg-black-200/40 p-6 hover:border-purple/40 transition-colors"
            >
              {post.coverImage ? (
                <div className="aspect-[16/10] md:aspect-[4/3] overflow-hidden rounded-xl bg-black-100">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              ) : (
                <div className="aspect-[16/10] md:aspect-[4/3] rounded-xl bg-gradient-to-br from-purple/20 to-blue-100/10 border border-white/10 flex items-center justify-center">
                  <span className="text-3xl text-white-100">{post.title[0]}</span>
                </div>
              )}
              <div className="flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[0.65rem] uppercase tracking-widest text-purple"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-purple transition-colors">
                  {post.title}
                </h2>
                <p className="text-white-200 text-sm md:text-base leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-white-200">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {format(new Date(post.publishedAt), "MMM d, yyyy")}
                    </time>
                  )}
                  <span>·</span>
                  <span>{post.readingTimeMinutes} min read</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </SubpageShell>
  );
}
