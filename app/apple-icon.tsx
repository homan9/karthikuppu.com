import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Apple touch icon from public/profile.png. iOS applies its own rounded-rect
// mask, so this stays a full square photo.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          style={{ objectFit: "cover" }}
          alt=""
        />
      </div>
    ),
    size,
  );
}
