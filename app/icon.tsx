import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Circular favicon generated from public/profile.png at build time — swap the
// photo and it regenerates itself (no manual asset work).
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  const data = readFileSync(join(process.cwd(), "public/profile.png"));
  const src = `data:image/png;base64,${data.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          width={size.width}
          height={size.height}
          style={{ objectFit: "cover", borderRadius: "50%" }}
          alt=""
        />
      </div>
    ),
    size,
  );
}
