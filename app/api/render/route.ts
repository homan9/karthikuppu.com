import path from "node:path";
import os from "node:os";
import { promises as fs } from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { getSceneMeta } from "@/remotion/scenes.meta";

// Local MP4 exporter. Bundles the Remotion entry once (cached across requests),
// renders the requested composition with the given props in headless Chrome,
// and streams the file back as a download. Runs only on your machine — no cloud.
export const runtime = "nodejs";
export const maxDuration = 600;

let bundlePromise: Promise<string> | null = null;
function getServeUrl() {
  if (!bundlePromise) {
    bundlePromise = bundle({
      entryPoint: path.join(process.cwd(), "remotion", "index.ts"),
      // Same assets the site serves, so "/avatars/..." resolves during render.
      publicDir: path.join(process.cwd(), "public"),
    });
  }
  return bundlePromise;
}

export async function POST(req: Request) {
  let body: { id?: string; inputProps?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { id, inputProps = {} } = body;
  if (!id) return new Response("Missing scene id", { status: 400 });
  const meta = getSceneMeta(id);
  if (!meta) return new Response(`Unknown scene: ${id}`, { status: 404 });

  const outPath = path.join(os.tmpdir(), `${id}-${Date.now()}.mp4`);

  try {
    const serveUrl = await getServeUrl();
    const composition = await selectComposition({ serveUrl, id, inputProps });
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      // yuv420p + even dimensions keep the MP4 playable everywhere (incl. X).
      pixelFormat: "yuv420p",
      outputLocation: outPath,
      inputProps,
    });

    const file = await fs.readFile(outPath);
    return new Response(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${id}.mp4"`,
        "Content-Length": String(file.byteLength),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? `${err.message}\n${err.stack ?? ""}` : String(err);
    return new Response(message, { status: 500 });
  } finally {
    await fs.rm(outPath, { force: true }).catch(() => {});
  }
}
