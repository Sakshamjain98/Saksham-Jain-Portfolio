import type { Metadata } from "next";

import { SubpageShell } from "@/components/site/SubpageShell";
import { SectionHeader } from "@/components/site/SectionHeader";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "How I architect systems — PRD to production. PRD/HLD/LLD discipline, database design, caching, queues, RBAC, observability, deployment.",
};

const PILLARS = [
  {
    eyebrow: "Step 0",
    title: "PRD · Decomposition",
    body:
      "Every system starts from a written PRD. Stakeholders, goals, non-goals, constraints, success metrics. Then decomposition: domain entities, bounded contexts, the smallest set of components that solves the problem without becoming someone else's problem next quarter.",
    accent: "from-emerald-500/15 to-emerald-500/0",
  },
  {
    eyebrow: "Step 1",
    title: "HLD — Components & Boundaries",
    body:
      "High-level diagram before code: where the request enters, what the trust boundary looks like, where the data lives, where the slow paths are. Drawn for review, not decoration. The HLD is the contract the LLD has to honor.",
    accent: "from-blue-500/15 to-blue-500/0",
  },
  {
    eyebrow: "Step 2",
    title: "LLD — Data, APIs, Sequences",
    body:
      "Schema-first: which collections, which indexes, which composite keys, which fields are write-once. API surface validated by zod at every boundary. Sequence diagrams for the non-obvious flows — auth, payments, reconciliation, anything stateful.",
    accent: "from-purple/20 to-purple/0",
  },
  {
    eyebrow: "Database",
    title: "Mongo Schema Design with Intent",
    body:
      "Document shape decided by the read pattern, not by the write pattern. Indexes added only after I've grepped for the query. Embedded vs referenced is a deliberate call per relationship. Migration scripts version-controlled alongside model files.",
    accent: "from-emerald-500/15 to-emerald-500/0",
  },
  {
    eyebrow: "Performance",
    title: "Caching, Queues, Edge",
    body:
      "Default to server components and edge runtime where it pays. Static-with-revalidate for read-heavy public pages. Write-through caches only when invalidation is cheap. Background jobs for anything > 200 ms — extracted from the request thread, never bolted on.",
    accent: "from-amber-500/15 to-amber-500/0",
  },
  {
    eyebrow: "Auth",
    title: "Sessions, Roles, RBAC",
    body:
      "NextAuth with credentials + magic link. JWT sessions for read paths, DB-backed verification tokens for email flows. Role lives on the user document, propagates through the JWT, gates admin routes via middleware. No string-comparing roles in 12 different files.",
    accent: "from-blue-500/15 to-blue-500/0",
  },
  {
    eyebrow: "Reliability",
    title: "Observability & Audit",
    body:
      "Structured logs at every boundary. Health endpoints that actually probe dependencies. Lead-table & resume-upload paths log who did what when. Errors get fingerprinted, not just stack-traced. Production is a system you can interrogate, not a black box.",
    accent: "from-rose-500/15 to-rose-500/0",
  },
  {
    eyebrow: "Delivery",
    title: "CI/CD · Vercel · Atlas",
    body:
      "PR previews on every push. Type-check + lint + build in CI before merge. Atlas with IP allowlists, distinct DBs per environment, daily backups. Zero-downtime deploys via Vercel; rollbacks are a single click. Secrets live in env vars, never in the tree.",
    accent: "from-cyan-500/15 to-cyan-500/0",
  },
];

const PRINCIPLES = [
  {
    title: "Validate at the boundary, trust the inside.",
    body:
      "User input, third-party webhooks, and storage reads cross the boundary; everything else is internal and gets to assume types are honest. zod once, then never again.",
  },
  {
    title: "The schema is the spec.",
    body:
      "If the data model can't express the rule, the rule won't survive the next refactor. Mongoose schemas + zod schemas align by hand; both versioned with migrations.",
  },
  {
    title: "Three lines is better than a premature abstraction.",
    body:
      "Don't extract until the third instance. Don't generalize on a sample size of one. Half-finished abstractions are the most expensive technical debt in any codebase.",
  },
  {
    title: "Reversibility > optionality.",
    body:
      "Every architectural decision should be easy to undo. Feature flags > forks. Replaceable adapters > leaky abstractions. The system has to keep working when I'm wrong.",
  },
];

export default function ArchitecturePage() {
  return (
    <SubpageShell>
      <SectionHeader
        eyebrow="How I architect systems"
        title={
          <>
            From PRD to <span className="text-purple">production</span>
          </>
        }
        subtitle="Eight steps that turn a one-line user need into a versioned, observable, scalable system. Every project on this site went through this gate."
      />

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {PILLARS.map((p, i) => (
          <article
            key={i}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black-200/40 p-6 md:p-8"
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${p.accent}`}
            />
            <div className="relative">
              <p className="uppercase tracking-widest text-xs text-blue-100 mb-3">
                {p.eyebrow}
              </p>
              <h3 className="text-xl md:text-2xl font-bold mb-3">{p.title}</h3>
              <p className="text-sm md:text-base text-white-100 leading-relaxed">
                {p.body}
              </p>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-24">
        <SectionHeader
          eyebrow="Principles I won't compromise on"
          title={
            <>
              How I make <span className="text-purple">judgment calls</span>
            </>
          }
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-6 md:p-8"
            >
              <h3 className="text-lg md:text-xl font-bold mb-3 text-purple">
                {p.title}
              </h3>
              <p className="text-sm md:text-base text-white-100 leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-24">
        <Footer />
      </div>
    </SubpageShell>
  );
}
