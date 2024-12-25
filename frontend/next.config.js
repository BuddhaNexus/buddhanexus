const { i18n } = require("./next-i18next.config");

const nextMDX = require("@next/mdx");

const NODE_ENV = process.env.NODE_ENV;
const SKIP_LINT = process.env.SKIP_LINT;

/** @type {import("next").NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  compiler: { emotion: true },
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: SKIP_LINT === "true",
  },
  basePath: NODE_ENV === "production" ? '/nexus' : undefined,
  // todo: remove after turbopack is stable
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  webpack(config, { isServer }) {
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true } };
    // if (!isServer && config.mode === "development") {
    // const { I18NextHMRPlugin } = require("i18next-hmr/webpack");
    // config.plugins.push(
    //   new I18NextHMRPlugin({
    //     localesDir: path.resolve(__dirname, "public/locales"),
    //   }),
    // );
    // }

    // We upload source maps for production.
    if (NODE_ENV === "production") {
      config.devtool = "hidden-source-map";
    }
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },

  experimental: {
    // turbo: {
    //   resolveExtensions: [
    //     ".mdx",
    //     ".md",
    //     ".tsx",
    //     ".ts",
    //     ".jsx",
    //     ".js",
    //     ".mjs",
    //     ".json",
    //   ],
    // },
  },
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: { providerImportSource: "@mdx-js/react" },
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(withMDX(nextConfig));
