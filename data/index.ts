// ──────────────────────────────────────────────────────────────────────────────
// Static content for the public site.
//
// Phase A: this file is the single source of truth.
// Phase B+: a CMS layer (lib/cms/*) will read from MongoDB and fall back here.
//
// Shapes are intentionally unchanged from the original scaffold so the existing
// design components (BentoGrid, Pin, MovingBorders, InfiniteCards, Lamp) keep
// rendering without refactor.
// ──────────────────────────────────────────────────────────────────────────────

export const navItems = [
  { name: "Home", link: "/#top" },
  { name: "About", link: "/#about" },
  { name: "Projects", link: "/projects" },
  { name: "Architecture", link: "/architecture" },
  { name: "Experience", link: "/#experience" },
  { name: "Blog", link: "/blog" },
  { name: "Resume", link: "/resume" },
  { name: "Contact", link: "/#contact" },
];

export const gridItems = [
  {
    id: 1,
    title:
      "I design backends and architecture before I write a single line of code.",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "/b1.svg",
    spareImg: "",
  },
  {
    id: 2,
    title: "Multi-region time zones and async-first collaboration.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My stack",
    description: "Production-grade by default",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title:
      "Systems thinker — PRD, HLD, LLD, sequence diagrams before sprint zero.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },
  {
    id: 5,
    title:
      "Currently shipping production systems for MetSupSpace and operating eight live sub-products.",
    description: "What I'm working on",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Have a system to design or scale? Let's build it.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Projects — eight live sub-products on *.sakshamjain.codes
// ──────────────────────────────────────────────────────────────────────────────

export const projects = [
  {
    id: 1,
    slug: "autograd",
    title: "AutoGrad",
    des: "Autonomous grading and AI-workflow orchestration platform — pipelines that ingest student work, run rubric-driven evaluation through LLM agents, and stream graded feedback at scale.",
    img: "/projects/autograd.svg",
    iconLists: ["/next.svg", "/ts.svg", "/tail.svg", "/re.svg", "/fm.svg"],
    link: "https://auto-grad.sakshamjain.codes",
  },
  {
    id: 2,
    slug: "bodh",
    title: "Bodh",
    des: "One-on-one online education platform connecting students with instructors. Personalized scheduling, interactive sessions, and certification flows backed by a scalable booking and content system.",
    img: "/projects/bodh.svg",
    iconLists: ["/next.svg", "/ts.svg", "/tail.svg", "/fm.svg", "/gsap.svg"],
    link: "https://bodh.sakshamjain.codes",
  },
  {
    id: 3,
    slug: "chtrust",
    title: "Karunya Charitable Trust",
    des: "Healthcare-affordability platform for an NGO operating out of Trivandrum. Donation routing, sponsored diagnostic packages, volunteer onboarding, and impact ledger that has touched 298k+ patients via 1000+ donors.",
    img: "/projects/chtrust.svg",
    iconLists: ["/next.svg", "/ts.svg", "/tail.svg", "/c.svg"],
    link: "https://chtrust.sakshamjain.codes",
  },
  {
    id: 4,
    slug: "gallera",
    title: "Gallera",
    des: "Visual / content-system platform with optimized media rendering, asset CDN integration, and a structured admin for creators to publish galleries with managed taxonomies.",
    img: "/projects/gallera.svg",
    iconLists: ["/next.svg", "/ts.svg", "/tail.svg", "/fm.svg"],
    link: "https://gallera.sakshamjain.codes",
  },
  {
    id: 5,
    slug: "kbg",
    title: "KBG",
    des: "Enterprise services platform — operational systems for development, maintenance, and security engagements. Lead intake, engagement tracking, billing primitives, and customer-facing portal.",
    img: "/projects/kbg.svg",
    iconLists: ["/next.svg", "/ts.svg", "/tail.svg", "/c.svg"],
    link: "https://kbg.sakshamjain.codes",
  },
  {
    id: 6,
    slug: "osa",
    title: "OSA",
    des: "Organizational systems backbone — workflow automation, internal tooling, and a permissions-aware admin surface for design and consulting operations.",
    img: "/projects/osa.svg",
    iconLists: ["/next.svg", "/ts.svg", "/tail.svg"],
    link: "https://osa.sakshamjain.codes",
  },
  {
    id: 7,
    slug: "syta",
    title: "SYTA — The E-Sakhi",
    des: "Scalable user platform with a focus on accessibility, multi-tenant content surfaces, and a secure data plane for sensitive user information.",
    img: "/projects/syta.svg",
    iconLists: ["/next.svg", "/ts.svg", "/tail.svg", "/re.svg"],
    link: "https://syta.sakshamjain.codes",
  },
  {
    id: 8,
    slug: "uddeshya",
    title: "Uddeshya",
    des: "Mission-driven engineering for an NGO at KIET — donations, programs, volunteer flows, and structured CMS so non-technical operators can ship updates without engineering involvement.",
    img: "/projects/uddeshya.svg",
    iconLists: ["/next.svg", "/ts.svg", "/tail.svg", "/re.svg"],
    link: "https://uddeshya.sakshamjain.codes",
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Testimonials — preserved from prior real engagements
// ──────────────────────────────────────────────────────────────────────────────

export const testimonials = [
  {
    quote:
      "Working with Saksham on the Bodh project has been an exceptional experience. His expertise in backend development ensured a smooth, scalable, and efficient system. He tackled complex challenges with ease, delivering high-quality solutions on time. His proactive approach and problem-solving skills made a significant impact on the project's success. Looking forward to collaborating again.",
    name: "Sudardhan",
    title: "Founder — MakeWithUs",
  },
  {
    quote:
      "Collaborating with Saksham was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Saksham's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Saksham is the ideal partner.",
    name: "Gaurav Payal",
    title: "President — Uddeshhya KIET",
  },
  {
    quote:
      "Saksham played a crucial role in bringing IdeaTex to life with his technical expertise and innovative mindset. His dedication and problem-solving skills ensured a seamless platform that enhanced the event experience for participants. His contribution was invaluable, and we truly appreciate his efforts in making IdeaTex a success.",
    name: "Head of Tech",
    title: "E-Cell, KIET",
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// "Companies" → repurposed as the live tech stack marquee
// (The Clients component renders this row as logo + label.)
// ──────────────────────────────────────────────────────────────────────────────

export const companies = [
  { id: 1, name: "Next.js", img: "/next.svg", nameImg: "" },
  { id: 2, name: "TypeScript", img: "/ts.svg", nameImg: "" },
  { id: 3, name: "React", img: "/re.svg", nameImg: "" },
  { id: 4, name: "Tailwind", img: "/tail.svg", nameImg: "" },
  { id: 5, name: "Three.js", img: "/three.svg", nameImg: "" },
  { id: 6, name: "Framer Motion", img: "/fm.svg", nameImg: "" },
  { id: 7, name: "GSAP", img: "/gsap.svg", nameImg: "" },
];

// ──────────────────────────────────────────────────────────────────────────────
// Work experience
// ──────────────────────────────────────────────────────────────────────────────

export const workExperience = [
  {
    id: 1,
    title: "Associate Software Engineer — MetSupSpace",
    desc: "Currently owning architecture and backend systems for production workloads. Drives PRD → HLD → implementation across a multi-product portfolio with a focus on scalability, security, and operational maturity.",
    className: "md:col-span-2",
    thumbnail: "/exp1.svg",
  },
  {
    id: 2,
    title: "Backend Developer — MakeWithUs (Bodh)",
    desc: "Five-month engagement designing and shipping backend infrastructure for the Bodh learning platform — APIs, data modelling, auth, scheduling primitives. Solved complex domain problems and delivered on time at production quality.",
    className: "md:col-span-2",
    thumbnail: "/exp2.svg",
  },
  {
    id: 3,
    title: "Tech Lead — E-Cell, KIET",
    desc: "Led the technology side for KIET's Entrepreneurship Cell. Owned ideation-to-launch for IdeaTex and the e-cell.in property — architecture, team coordination, and delivery on a fixed event timeline.",
    className: "md:col-span-2",
    thumbnail: "/exp3.svg",
  },
  {
    id: 4,
    title: "Freelance & Open Source",
    desc: "Independent engagements across NGOs (Uddeshhya, Karunya Trust) and indie products. Open-source contributor — shipped DocMan, a VS Code extension that auto-generates docs and READMEs from source.",
    className: "md:col-span-2",
    thumbnail: "/exp4.svg",
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Social
// ──────────────────────────────────────────────────────────────────────────────

export const socialMedia = [
  { id: 1, img: "/git.svg", link: "https://github.com/Sakshamjain98" },
  { id: 2, img: "/twit.svg", link: "https://x.com/Saksham_Jain007" },
  { id: 3, img: "/link.svg", link: "https://www.linkedin.com/in/sakshamjain007" },
];

// ──────────────────────────────────────────────────────────────────────────────
// Profile constants — used by Hero, BentoGrid copy-email, Footer, metadata
// ──────────────────────────────────────────────────────────────────────────────

export const profile = {
  name: "Saksham Jain",
  role: "Senior-track Full-Stack Engineer · Systems Architect",
  location: "India",
  publicEmail: "sakshamdevs007@gmail.com",
  taglineEyebrow: "Building production systems with depth, ownership, and architecture-first thinking",
  heroHeadline:
    "I'm Saksham — I architect backends, ship full-stack products, and operate them in production.",
  heroSub:
    "Full-stack engineering · System design · AI infrastructure · CMS platforms",
  ctaLabel: "See the systems I've built",
};

export const stackTiles = {
  left: ["TypeScript", "Node.js", "MongoDB"],
  right: ["Next.js", "React", "Mongoose"],
};
