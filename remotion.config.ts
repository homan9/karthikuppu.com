import { Config } from "@remotion/cli/config";

// Config for Remotion Studio and the CLI renderer. The programmatic exporter
// (app/api/render) sets its own equivalents inline.
//
// publicDir points at Next's public/ so staticFile()/absolute "/avatars/..."
// paths resolve to the same assets the site serves — one asset source.
Config.setPublicDir("./public");
Config.setVideoImageFormat("jpeg");
Config.overrideWebpackConfig((config) => config);
