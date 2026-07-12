import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Let `.md` / `.mdx` files be treated as first-class modules/pages.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // Pin the workspace root to THIS directory. A stray package-lock.json one dir
  // up otherwise makes Turbopack infer the parent as the root, which mismatches
  // the client manifest paths (breaks dev with a global-error.js manifest error).
  turbopack: { root: import.meta.dirname },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // String plugin names (with serializable options) so they work under Turbopack.
    // `remark-frontmatter` parses the YAML block into a non-rendered node, so the
    // frontmatter never shows up in the essay body. We read it separately with
    // gray-matter in lib/posts.ts.
    remarkPlugins: [["remark-frontmatter", "yaml"], "remark-gfm"],
  },
});

export default withMDX(nextConfig);
