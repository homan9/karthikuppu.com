import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostMeta, getPostSlugs, formatDate } from "@/lib/posts";
import { site } from "@/lib/site";
import { FootnoteLinks } from "@/components/FootnoteLinks";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPostSlugs().map((slug) => ({ slug }));
}

// 404 for any slug that isn't a real post.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getPostMeta(slug);
  if (!meta) return {};

  const images = meta.heroImageSrc
    ? [{ url: meta.heroImageSrc, width: 1200, height: 630, alt: meta.title }]
    : undefined;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: `${site.url}/${slug}`,
      publishedTime: meta.date || undefined,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images,
    },
  };
}

export default async function EssayPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const meta = getPostMeta(slug);
  if (!meta) notFound();

  // Compile & render the MDX body. Frontmatter is stripped by remark-frontmatter,
  // so this renders only the essay content (and any <Visualization /> it references).
  const { default: Content } = await import(`@/posts/${slug}.mdx`);

  return (
    <>
      {/* Full-width top fade: content dissolves into the background near the top
          so the fixed profile pic reads cleanly over anything below it. */}
      <div className="top-fade" aria-hidden="true" />

      {/* Fixed circular profile pic, top-left, links home. */}
      <Link href="/" className="home-corner" aria-label="Home">
        <Image
          className="home-corner__img"
          src="/profile.png"
          alt="Home"
          width={48}
          height={48}
        />
      </Link>

      <main className="page essay-page">
        {/* Header staggers in first... */}
        <header className="reveal">
          {/* Same size as everything else; distinguished only by weight + color. */}
          <h1 className="essay-title">{meta.title}</h1>
          <p className="essay-date">{formatDate(meta.date)}</p>
        </header>

        {/* ...then each block of the essay body lays itself down in turn. */}
        <article className="essay-body reveal essay-article">
          <Content />
        </article>
      </main>

      {/* Footnote links scroll without adding a #hash and clear the top fade. */}
      <FootnoteLinks />
    </>
  );
}
