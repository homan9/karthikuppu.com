// Central site config. Set NEXT_PUBLIC_SITE_URL in the environment for production
// so that Open Graph / Twitter image URLs resolve to absolute URLs.
export const site = {
  name: "Karthik Uppu",
  // Must match the domain the site is actually served from, so preview images
  // (absolute URLs) resolve. Override per-deploy with NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://karthikuppu.com",
  description: "",
  // Optional: your X/Twitter handle, used for twitter:creator.
  twitter: "",
  // The image shown in social/link previews — just the profile pic (square).
  ogImage: { url: "/profile.png", width: 500, height: 500 },
} as const;
