const { i18n } = require("./next-i18next.config");
const nextMDX = require("@next/mdx");
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    fontLoaders: [
      {
        loader: "@next/font/google",
        options: { subsets: ["latin", "latin-ext"] },
      },
    ],
  },
  i18n,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  webpack(config, { isServer }) {
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true } };
    if (config.mode === "development") {
      const { I18NextHMRPlugin } = require("i18next-hmr/plugin");
      config.plugins.push(
        new I18NextHMRPlugin({
          localesDir: path.resolve(__dirname, "public/locales"),
        })
      );
    }
    return config;
  },
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: { providerImportSource: "@mdx-js/react" },
});

module.exports = withMDX(nextConfig);