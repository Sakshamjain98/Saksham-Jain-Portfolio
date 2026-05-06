import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode, { type Options as RehypePrettyOptions } from "rehype-pretty-code";

import { mdxComponents } from "./components";

const prettyCodeOptions: RehypePrettyOptions = {
  theme: "github-dark-dimmed",
  keepBackground: false,
  defaultLang: "plaintext",
};

/**
 * Server component — renders an MDX string into JSX with syntax-highlighted
 * code blocks. Use inside RSCs (the blog detail page); not safe in client
 * components.
 */
export function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
        },
      }}
    />
  );
}
