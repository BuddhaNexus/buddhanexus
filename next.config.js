const { i18n } = require("./next-i18next.config");
const nextMDX = require("@next/mdx");

/** @type {import("next").NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  compiler: { emotion: true },
  experimental: {
    turbo: {
      resolveExtensions: [
        ".mdx",
        ".md",
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".mjs",
        ".json",
      ],
    },
  },
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: { providerImportSource: "@mdx-js/react" },
});

module.exports = withMDX(nextConfig);
