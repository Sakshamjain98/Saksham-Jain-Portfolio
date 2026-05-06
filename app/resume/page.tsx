import type { Metadata } from "next";
import { format } from "date-fns";
import { FaDownload, FaEye } from "react-icons/fa6";

import { getActiveResumeMeta } from "@/lib/cms/resume";
import { getAllExperience } from "@/lib/cms/experience";
import { profile } from "@/data";
import { SubpageShell } from "@/components/site/SubpageShell";
import { SectionHeader } from "@/components/site/SectionHeader";
import Footer from "@/components/Footer";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Resume",
  description: "Download Saksham Jain's resume — full-stack engineer & systems architect.",
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function ResumePage() {
  const [resume, experience] = await Promise.all([
    getActiveResumeMeta(),
    getAllExperience(),
  ]);

  return (
    <SubpageShell>
      <SectionHeader
        eyebrow="Curriculum vitae"
        title={
          <>
            Saksham Jain &mdash; <span className="text-purple">resume</span>
          </>
        }
        subtitle={profile.role}
      />

      <div className="mt-12 max-w-3xl mx-auto">
        {resume ? (
          <div className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-widest text-blue-100">
                  Latest version
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {resume.filename}
                </p>
                <p className="text-sm text-white-200 mt-2">
                  {formatBytes(resume.size)} ·{" "}
                  Updated {format(new Date(resume.updatedAt), "MMM d, yyyy")}
                </p>
                {resume.notes && (
                  <p className="text-sm text-white-100 mt-3">{resume.notes}</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/api/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold hover:border-white/50 transition-colors"
                >
                  <FaEye className="text-xs" />
                  Preview
                </a>
                <a
                  href="/api/resume?download=1"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple text-black-100 px-5 py-2.5 text-sm font-semibold hover:bg-purple/90 transition-colors"
                >
                  <FaDownload className="text-xs" />
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-12 text-center">
            <p className="text-white-100 text-lg">
              Resume not yet uploaded.
            </p>
            <p className="text-white-200 text-sm mt-2">
              Upload from the admin panel at{" "}
              <code className="text-purple">/admin/resume</code>.
            </p>
          </div>
        )}

        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Experience</h2>
          <ol className="relative border-l border-white/10 pl-6 space-y-10">
            {experience.map((e) => (
              <li key={e.id} className="relative">
                <span className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-purple ring-4 ring-black-100" />
                <p className="text-xs uppercase tracking-widest text-blue-100">
                  {format(new Date(e.startDate), "MMM yyyy")}
                  {" — "}
                  {e.endDate ? format(new Date(e.endDate), "MMM yyyy") : "Present"}
                </p>
                <h3 className="mt-1 text-lg md:text-xl font-bold text-white">
                  {e.title}
                </h3>
                {e.company && (
                  <p className="text-sm text-purple">{e.company}</p>
                )}
                <p className="mt-3 text-sm md:text-base text-white-100 leading-relaxed">
                  {e.description}
                </p>
                {e.highlights.length > 0 && (
                  <ul className="mt-3 list-disc list-outside pl-5 space-y-1 text-sm text-white-100">
                    {e.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </SubpageShell>
  );
}
