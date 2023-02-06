import type { SupportedLocale } from "types/i18next";

type Route<Type extends string> = {
  [Item in Type]: string;
};

type LocalizedRoutes = Record<string, Route<SupportedLocale>>;
type LocaleRewrites = Record<string, { locale: string; rewriteUrl: string }>;

// TODO: ideally, the routes and rewrites objects should be dynamically generated.

const postRoutes: LocalizedRoutes = {
  "author-and-translators-identification-initiative": {
    en: "news/author-and-translators-identification-initiative",
    de: "nachrichten/author-and-translators-identification-initiative",
  },
  "buddhanexus-in-the-digital-orientalist": {
    en: "news/buddhanexus-in-the-digital-orientalist",
    de: "nachrichten/buddhanexus-im-digitalen-orientalisten",
  },
  "buddhanexus-published": {
    en: "news/buddhanexus-published",
    de: "nachrichten/buddhanexus-veröffentlicht",
  },
  "buddhanexus-updates-2021": {
    en: "news/buddhanexus-updates-2021",
    de: "nachrichten/buddhanexus-aktualisierungen-2021",
  },
};

const postRewrites: LocaleRewrites = {
  "/news/author-and-translators-identification-initiative": {
    locale: "en",
    rewriteUrl: "/news/author-and-translators-identification-initiative",
  },
  "/nachrichten/author-and-translators-identification-initiative": {
    locale: "de",
    rewriteUrl: "/news/author-and-translators-identification-initiative",
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
  "/nachrichten/buddhanexus-veröffentlicht": {
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

export const routes: LocalizedRoutes = {
  introduction: {
    en: "introduction",
    de: "einführung",
  },
  history: {
    en: "history",
    de: "geschichte",
  },
  guidelines: {
    en: "guidelines",
    de: "richtlinien",
  },
  contact: {
    en: "contact",
    de: "kontakt",
  },
  institutions: {
    en: "institutions",
    de: "institutionen",
  },
  people: {
    en: "people",
    de: "personen",
  },
  news: {
    en: "news",
    de: "nachrichten",
  },
  publications: {
    en: "publications",
    de: "veröffentlichungen",
  },
  events: {
    en: "events",
    de: "veranstaltungen",
  },
  projects: {
    en: "projects",
    de: "projekte",
  },
  presentations: {
    en: "presentations",
    de: "präsentationen",
  },
  ...postRoutes,
};

export const rewrites: LocaleRewrites = {
  /* url that the user visits */
  "/introduction": {
    locale: "en",
    // the route that is rendered
    rewriteUrl: "/introduction",
  },
  "/history": {
    locale: "en",
    rewriteUrl: "/history",
  },
  "/guidelines": {
    locale: "en",
    rewriteUrl: "/guidelines",
  },
  "/contact": {
    locale: "en",
    rewriteUrl: "/contact",
  },
  "/institutions": {
    locale: "en",
    rewriteUrl: "/institutions",
  },
  "/people": {
    locale: "en",
    rewriteUrl: "/people",
  },
  "/news": {
    locale: "en",
    rewriteUrl: "/news",
  },
  "/publications": {
    locale: "en",
    rewriteUrl: "/publications",
  },
  "/events": {
    locale: "en",
    rewriteUrl: "/events",
  },
  "/projects": {
    locale: "en",
    rewriteUrl: "/projects",
  },
  "/presentations": {
    locale: "en",
    rewriteUrl: "/presentations",
  },
  // ----------------------------
  // DE
  // ----------------------------
  "/einführung": {
    locale: "de",
    rewriteUrl: "/introduction",
  },
  "/geschichte": {
    locale: "de",
    rewriteUrl: "/history",
  },
  "/richtlinien": {
    locale: "de",
    rewriteUrl: "/guidelines",
  },
  "/kontakt": {
    locale: "de",
    rewriteUrl: "/contact",
  },
  "/institutionen": {
    locale: "de",
    rewriteUrl: "/institutions",
  },
  "/personen": {
    locale: "de",
    rewriteUrl: "/people",
  },
  "/nachrichten": {
    locale: "de",
    rewriteUrl: "/news",
  },
  "/veröffentlichungen": {
    locale: "de",
    rewriteUrl: "/publications",
  },
  "/veranstaltungen": {
    locale: "de",
    rewriteUrl: "/events",
  },
  "/projekte": {
    locale: "de",
    rewriteUrl: "/projects",
  },
  "/präsentationen": {
    locale: "de",
    rewriteUrl: "/presentations",
  },
  ...postRewrites,
};
