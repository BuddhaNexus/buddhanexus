const { i18n } = require("./next-i18next.config");
const nextMDX = require("@next/mdx");
const path = require("path");

/** @type {import("next").NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
  compiler: { emotion: true },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  webpack(config, { isServer }) {
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true } };
    if (!isServer && config.mode === "development") {
      const { I18NextHMRPlugin } = require("i18next-hmr/webpack");
      config.plugins.push(
        new I18NextHMRPlugin({
          localesDir: path.resolve(__dirname, "public/locales"),
        }),
      );
    }
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: { providerImportSource: "@mdx-js/react" },
});

module.exports = withMDX(nextConfig);
