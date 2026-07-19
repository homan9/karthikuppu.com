// Single source of truth for theme tokens on the TS / Remotion side.
//
// Remotion compositions render in an isolated bundle with no access to the
// site's CSS custom properties (the global stylesheet does not exist in the
// render server), so the palette defined as :root vars in app/globals.css is
// mirrored here for anything that paints inside a scene or its inspector.
//
// Keep these in sync with the matching --tokens in app/globals.css. This file
// has NO React / remotion imports, so it's safe in server components and in the
// /api/render route.
export const THEME = {
  background: "#fdfdfc", // page background — barely-warm white
  ink: "#1c1c1a", // body text
  inkStrong: "#0b0b0a", // titles / emphasis
  caption: "#a6a6a1", // dates, secondary
  hairline: "#ebebe7", // faint dividers
  // vizBg: "#fbfbfa", // visualization / video surface — near page-white
  vizBg: "#fff",
  vizEdge: "#eeeeea", // hairline that separates a viz surface from the page
} as const;
