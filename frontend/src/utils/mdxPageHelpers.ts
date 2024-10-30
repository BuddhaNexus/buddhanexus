import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import type { SupportedLocale } from "src/types/i18next";

import {
  MDX_COMPONENTS,
  MDX_IMPORTS,
  MDX_PROPS,
  type MDXPageDataStore,
} from "./mdxPageImports";

export interface MDXFrontmatter {
  title: string;
  date: string;
  keywords: string;
  description: string;
  componentList?: string[];
  propsList?: string[];
  importsList?: string[];
}

export interface MDXData {
  slug: string;
  meta: MDXFrontmatter;
  content: string;
}
export interface CompiledMDXData {
  slug: string;
  meta: MDXFrontmatter;
  content: MDXRemoteSerializeResult;
}

type MDXPagePath = { params: { slug: string }; locale: string };

export const POST_DATE_OPTS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export function getMDXContentBySlug(
  pathBase: string,
  slug: string,
  locale = "en",
): MDXData {
  const itemPath = path.join(`${pathBase}/${slug}/${locale}.mdx`);
  const fileContents = fs.readFileSync(itemPath, "utf8");
  const { content, data } = matter(fileContents);
  const meta = data as MDXFrontmatter;

  return { slug, meta, content };
}

export function getAllPosts(pathBaseItems: string[], lang: string) {
  const dirPath = pathBaseItems
    .reduce((acc, item) => `${acc}/${item}`, "")
    .slice(1);

  const slugs = fs.readdirSync(dirPath);

  const posts = slugs
    .map((slug) => getMDXContentBySlug(pathBaseItems.join("/"), slug, lang))
    .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1));

  return posts;
}

export function getMDXPageComponents({
  componentList,
  propsList,
  importsList,
}: {
  componentList: string[];
  propsList: string[];
  importsList: string[];
}) {
  const components: MDXPageDataStore = {};
  if (componentList) {
    for (const component of componentList) {
      components[component] = MDX_COMPONENTS[component];
    }
  }
  const props: MDXPageDataStore = {};
  if (propsList) {
    for (const prop of propsList) {
      props[prop] = MDX_PROPS[prop];
    }
  }
  const imports: MDXPageDataStore = {};
  if (importsList) {
    for (const item of importsList) {
      imports[item] = MDX_IMPORTS[item];
    }
  }
  return { components, props: { ...props, ...imports } };
}

export function getMDXPagePaths(
  dirnames: string[],
  locales: SupportedLocale[],
) {
  const paths: MDXPagePath[] = [];

  for (const dir of dirnames) {
    for (const locale of locales) {
      paths.push({ params: { slug: dir }, locale });
    }
  }

  return paths;
}
