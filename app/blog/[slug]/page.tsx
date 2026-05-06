import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { FaArrowLeft } from "react-icons/fa6";

import { getPostBySlug, getPostSlugs, getPublishedPosts } from "@/lib/cms/blog";
import { MdxContent } from "@/lib/mdx/render";
import { SubpageShell } from "@/components/site/SubpageShell";
import Footer from "@/components/Footer";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: post.ogImage ? [post.ogImage] : post.coverImage ? [post.coverImage] : undefined,
      publishedTime: post.publishedAt ?? undefined,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = await getPublishedPosts();
  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  return (
    <SubpageShell>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-white-200 hover:text-white transition-colors mb-10"
      >
        <FaArrowLeft className="text-xs" />
        Back to blog
      </Link>

      <article className="max-w-3xl mx-auto">
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((t) => (
              <span
                key={t}
                className="text-[0.65rem] uppercase tracking-widest text-purple"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            {post.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white-100 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm text-white-200">
            <span>{post.authorName ?? post.authorEmail}</span>
            {post.publishedAt && (
              <>
                <span>·</span>
                <time dateTime={post.publishedAt}>
                  {format(new Date(post.publishedAt), "MMM d, yyyy")}
                </time>
              </>
            )}
            <span>·</span>
            <span>{post.readingTimeMinutes} min read</span>
          </div>
        </header>

        {post.coverImage && (
          <div className="overflow-hidden rounded-2xl border border-white/10 mb-12 aspect-[16/9] bg-black-200">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          <MdxContent source={post.contentMdx} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-24 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Related reading
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group rounded-xl border border-white/[0.08] bg-black-200/40 p-5 hover:border-purple/40 transition-colors"
              >
                <h3 className="font-bold mb-2 group-hover:text-purple transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-white-200 line-clamp-2">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-24">
        <Footer />
      </div>
    </SubpageShell>
  );
}
