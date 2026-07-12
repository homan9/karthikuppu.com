// Central site config. Set NEXT_PUBLIC_SITE_URL in the environment for production
// so that Open Graph / Twitter image URLs resolve to absolute URLs.
export const site = {
  name: "Karthik Uppu",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://karthikuppuluri.com",
  description: "",
  // Optional: your X/Twitter handle, used for twitter:creator.
  twitter: "",
  // The image shown in social/link previews — just the profile pic (square).
  ogImage: { url: "/profile.png", width: 500, height: 500 },
} as const;
