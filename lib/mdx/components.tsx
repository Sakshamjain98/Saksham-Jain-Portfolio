import Link from "next/link";
import type { MDXComponents } from "mdx/types";

function Heading({ as: Tag, children, ...rest }: any) {
  const sizes: Record<string, string> = {
    h1: "text-3xl md:text-4xl mt-12 mb-6",
    h2: "text-2xl md:text-3xl mt-12 mb-5",
    h3: "text-xl md:text-2xl mt-10 mb-4",
    h4: "text-lg md:text-xl mt-8 mb-3",
  };
  return (
    <Tag
      {...rest}
      className={`scroll-mt-32 font-bold text-white tracking-tight ${sizes[Tag] ?? ""}`}
    >
      {children}
    </Tag>
  );
}

export const mdxComponents: MDXComponents = {
  h1: (props) => <Heading as="h1" {...props} />,
  h2: (props) => <Heading as="h2" {...props} />,
  h3: (props) => <Heading as="h3" {...props} />,
  h4: (props) => <Heading as="h4" {...props} />,

  p: (props) => (
    <p className="text-white-100 leading-relaxed text-base md:text-lg my-5" {...props} />
  ),

  ul: (props) => (
    <ul className="list-disc list-outside pl-6 my-5 space-y-2 text-white-100" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal list-outside pl-6 my-5 space-y-2 text-white-100" {...props} />
  ),
  li: (props) => <li className="text-base md:text-lg leading-relaxed" {...props} />,

  a: ({ href, children, ...rest }: any) => {
    const isInternal = typeof href === "string" && (href.startsWith("/") || href.startsWith("#"));
    if (isInternal) {
      return (
        <Link href={href} className="text-purple underline underline-offset-2 hover:text-purple/80" {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple underline underline-offset-2 hover:text-purple/80"
        {...rest}
      >
        {children}
      </a>
    );
  },

  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-4 border-purple/60 bg-black-200/40 pl-5 pr-4 py-3 italic text-white-100 rounded-r-md"
      {...props}
    />
  ),

  hr: () => <hr className="my-12 border-white/10" />,

  // Inline code
  code: ({ className, children, ...rest }: any) => {
    if (className) {
      // Code inside <pre> — let rehype-pretty-code style it
      return (
        <code className={className} {...rest}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded bg-black-200 border border-white/10 px-1.5 py-0.5 text-[0.85em] text-purple"
        {...rest}
      >
        {children}
      </code>
    );
  },

  // Code block container — rehype-pretty-code injects data-language attrs
  pre: ({ children, ...rest }: any) => (
    <pre
      className="my-6 rounded-2xl border border-white/10 bg-[#0d1117] p-5 overflow-x-auto text-sm leading-relaxed"
      {...rest}
    >
      {children}
    </pre>
  ),

  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="bg-black-200 text-left px-4 py-2.5 font-semibold text-white" {...props} />
  ),
  td: (props) => <td className="px-4 py-2.5 border-t border-white/10 text-white-100" {...props} />,

  img: ({ src, alt, ...rest }: any) => (
    <img
      src={src}
      alt={alt ?? ""}
      className="my-8 rounded-2xl border border-white/10 w-full"
      {...rest}
    />
  ),
};
