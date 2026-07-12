// Central site config. Set NEXT_PUBLIC_SITE_URL in the environment for production
// so that Open Graph / Twitter image URLs resolve to absolute URLs.
export const site = {
  name: "Karthik Uppu",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://karthikuppuluri.com",
  description: "",
  // Optional: your X/Twitter handle, used for twitter:creator.
  twitter: "",
} as const;
