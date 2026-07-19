import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { scenesMeta, getSceneMeta } from "@/remotion/scenes.meta";
import { VideoInspector } from "@/components/VideoInspector";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return scenesMeta.map((s) => ({ id: s.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const meta = getSceneMeta(id);
  return { title: meta ? `${meta.title} · video` : "Video", robots: { index: false } };
}

export default async function VideoPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const meta = getSceneMeta(id);
  if (!meta) notFound();

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
      <Link href="/videos" style={{ color: "var(--caption)", fontSize: "0.85rem" }}>← Videos</Link>
      <h1 style={{ fontSize: "1.4rem", margin: "0.75rem 0 1.5rem" }}>{meta.title}</h1>
      <VideoInspector meta={meta} />
    </main>
  );
}
