import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "posts");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO string, e.g. "2026-01-24"
  heroImageSrc?: string; // path under /public, e.g. "/posts/village.png"
};

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

/** Read just the frontmatter for a single post (no MDX compilation). */
export function getPostMeta(slug: string): PostMeta | null {
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const mdPath = path.join(POSTS_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: data.date ? String(data.date) : "",
    heroImageSrc: data.heroImageSrc ? String(data.heroImageSrc) : undefined,
  };
}

/** All posts' metadata, newest first. */
export function getAllPostsMeta(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => getPostMeta(slug))
    .filter((m): m is PostMeta => m !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Format an ISO date as e.g. "January 24, 2026". */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
