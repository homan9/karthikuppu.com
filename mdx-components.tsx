import type { MDXComponents } from "mdx/types";
import * as visualizations from "@/visualizations";

// Registered globally so essays can reference any visualization by name,
// directly in the markdown, without an import statement.
const components: MDXComponents = {
  ...visualizations,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
