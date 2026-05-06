import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

import { getAllProjects } from "@/lib/cms/projects";
import { SubpageShell } from "@/components/site/SubpageShell";
import { SectionHeader } from "@/components/site/SectionHeader";
import { StatusPill } from "@/components/site/StatusPill";
import Footer from "@/components/Footer";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Eight live sub-products on sakshamjain.codes — production systems with real architecture, real users, and real engineering trade-offs.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <SubpageShell>
      <SectionHeader
        eyebrow="The portfolio of systems"
        title={
          <>
            Eight live <span className="text-purple">sub-products</span>
          </>
        }
        subtitle="Each one is a real codebase, a real database, and a real production deployment. Click through to read the architecture."
      />

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black-200/40 hover:border-purple/40 transition-colors"
          >
            <div className="aspect-[16/10] overflow-hidden bg-black-100">
              {p.coverImage && (
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">{p.title}</h3>
                <StatusPill status={p.status} />
              </div>
              <p className="text-sm text-white-200 line-clamp-3 min-h-[3.75rem]">
                {p.tagline}
              </p>
              <div className="flex items-center justify-between mt-5">
                <div className="flex -space-x-2">
                  {p.iconLists.slice(0, 5).map((icon, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border border-white/20 bg-black-100 flex items-center justify-center"
                    >
                      <img src={icon} alt="" className="w-4 h-4" />
                    </div>
                  ))}
                </div>
                <span className="flex items-center gap-2 text-sm text-purple group-hover:gap-3 transition-all">
                  Read architecture
                  <FaArrowRight className="text-xs" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </SubpageShell>
  );
}
