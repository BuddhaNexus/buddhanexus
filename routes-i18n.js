export const routes = {
  news: {
    en: "/news",
    de: "/nachrichten",
  },
  introduction: {
    en: "/introduction",
    de: "/einfuhrung",
  },
};

export const rewrites = {
  "/news": /* url that the user visits */ {
    locale: "en",
    rewriteUrl: "/news", // the route that is rendered
  },
  "/nachrichten": {
    locale: "de",
    rewriteUrl: "/news",
  },
  "/introduction": {
    locale: "en",
    rewriteUrl: "/introduction",
  },
  "/einfuhrung": {
    locale: "de",
    rewriteUrl: "/introduction",
  },
  "/news/author-and-translators-identification-inittiative": {
    locale: "en",
    rewriteUrl: "/news/author-and-translators-identification-inittiative",
  },
  "/nachrichten/autor-und-ubersetzer-identifikationsinitiative": {
    locale: "de",
    rewriteUrl: "/news/author-and-translators-identification-inittiative",
  },
  "/news/buddhanexus-in-the-digital-orientalist": {
    locale: "en",
    rewriteUrl: "/news/buddhanexus-in-the-digital-orientalist",
  },
  "/nachrichten/buddhanexus-im-digitalen-orientalisten": {
    locale: "de",
    rewriteUrl: "/news/buddhanexus-in-the-digital-orientalist",
  },
  "/news/buddhanexus-published": {
    locale: "en",
    rewriteUrl: "/news/buddhanexus-published",
  },
  "/nachrichten/buddhanexus-veroffentlicht": {
    locale: "de",
    rewriteUrl: "/news/buddhanexus-published",
  },
  "/news/buddhanexus-updates-2021": {
    locale: "en",
    rewriteUrl: "/news/buddhanexus-updates-2021",
  },
  "/nachrichten/buddhanexus-aktualisierungen-2021": {
    locale: "de",
    rewriteUrl: "/news/buddhanexus-updates-2021",
  },
};

export default routes;
