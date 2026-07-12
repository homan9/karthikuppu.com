"use client";

import { useEffect } from "react";

/**
 * Makes in-essay footnote links (the superscript reference and the "back to
 * content" arrow) scroll smoothly WITHOUT adding a #hash to the URL, and lands
 * the target a bit below the top of the viewport so it isn't hidden behind the
 * fixed top fade / profile pic.
 */
export function FootnoteLinks() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;

      const anchor = (event.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      // Only handle same-page anchors inside an essay body (footnote refs/backrefs).
      if (!anchor || !anchor.closest(".essay-body")) return;

      const id = decodeURIComponent(anchor.getAttribute("href")!.slice(1));
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();

      const rootStyles = getComputedStyle(document.documentElement);
      const rem = parseFloat(rootStyles.fontSize) || 16;
      const fadeHeight =
        parseFloat(rootStyles.getPropertyValue("--top-fade-height")) || 112;
      // Clear the top fade, plus a little breathing room.
      const offset = fadeHeight + 1.5 * rem;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
