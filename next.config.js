const { i18n } = require("./next-i18next.config");
const nextMDX = require("@next/mdx");
const path = require("path");

/** @type {import("next").NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  compiler: { emotion: true },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: { providerImportSource: "@mdx-js/react" },
});

module.exports = withMDX(nextConfig);
