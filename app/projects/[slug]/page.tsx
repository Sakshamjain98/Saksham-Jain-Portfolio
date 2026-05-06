import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaArrowUpRightFromSquare } from "react-icons/fa6";

import { getAllProjects, getProjectBySlug, getProjectSlugs } from "@/lib/cms/projects";
import { SubpageShell } from "@/components/site/SubpageShell";
import { StatusPill } from "@/components/site/StatusPill";
import Footer from "@/components/Footer";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const siblings = (await getAllProjects()).filter((p) => p.slug !== project.slug);

  return (
    <SubpageShell>
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-white-200 hover:text-white transition-colors mb-10"
      >
        <FaArrowLeft className="text-xs" />
        All projects
      </Link>

      <header className="max-w-4xl">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <StatusPill status={project.status} />
          {project.technologies.length > 0 && (
            <span className="text-xs text-white-200">
              {project.technologies.slice(0, 4).join(" · ")}
            </span>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          {project.title}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white-100 leading-relaxed">
          {project.tagline}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-purple text-black-100 px-5 py-2.5 text-sm font-semibold hover:bg-purple/90 transition-colors"
            >
              View live
              <FaArrowUpRightFromSquare className="text-xs" />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold hover:border-white/50 transition-colors"
            >
              View repository
              <FaArrowUpRightFromSquare className="text-xs" />
            </a>
          )}
        </div>
      </header>

      {project.coverImage && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08] aspect-[16/9] bg-black-200">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="mt-16 grid gap-12 lg:grid-cols-[2fr_1fr]">
        <article className="space-y-12">
          {project.sections
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((section, i) => (
              <section key={i}>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {section.heading}
                </h2>
                <div className="text-base md:text-lg text-white-100 leading-relaxed whitespace-pre-line">
                  {section.body}
                </div>
              </section>
            ))}
        </article>

        <aside className="space-y-8 lg:sticky lg:top-32 lg:self-start">
          {project.iconLists.length > 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-6">
              <h3 className="text-sm uppercase tracking-widest text-blue-100 mb-4">
                Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.iconLists.map((icon, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border border-white/20 bg-black-100 flex items-center justify-center"
                  >
                    <img src={icon} alt="" className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-6">
            <h3 className="text-sm uppercase tracking-widest text-blue-100 mb-4">
              Want this kind of system?
            </h3>
            <p className="text-sm text-white-200 mb-4 leading-relaxed">
              I work on systems like this one — architecture, backend depth, production operations.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple"
            >
              Start a conversation
              <FaArrowUpRightFromSquare className="text-xs" />
            </Link>
          </div>
        </aside>
      </div>

      {siblings.length > 0 && (
        <section className="mt-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">More projects</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {siblings.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="group rounded-xl border border-white/[0.08] bg-black-200/40 p-5 hover:border-purple/40 transition-colors"
              >
                <h3 className="font-bold mb-2 group-hover:text-purple transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-white-200 line-clamp-2">{p.tagline}</p>
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
