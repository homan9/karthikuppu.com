import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes } from "react";
import * as visualizations from "@/visualizations";

// External links (http/https) open in a new tab; internal routes and in-page
// anchors (e.g. footnotes) keep their default same-tab behavior.
function Anchor({
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = typeof href === "string" && /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      {...props}
    />
  );
}

// Registered globally so essays can reference any visualization by name,
// directly in the markdown, without an import statement.
const components: MDXComponents = {
  ...visualizations,
  a: Anchor,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
