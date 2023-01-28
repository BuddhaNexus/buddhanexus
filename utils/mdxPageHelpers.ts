import fs from "fs";
import matter from "gray-matter";
import path from "path";

import {
  type MDXPageDataStore,
  MDX_COMPONENTS,
  MDX_IMPORTS,
  MDX_PROPS,
} from "./mdxPageImports";

export interface PostFrontmatter {
  title: string;
  date: string;
  keywords: string;
  description: string;
  slug: string;
  components?: string[];
  props?: string[];
  imports?: string[];
}

export interface MDXData {
  slug: string;
  meta: PostFrontmatter;
  content: string;
}
export interface CompiledMDXData {
  slug: string;
  meta: PostFrontmatter;
  content: { compiledSource: string };
}

export const POST_DATE_OPTS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export function getMDXContentBySlug(
  pathBase: string,
  slug: string,
  locale = "en"
): MDXData {
  const itemPath = path.join(`${pathBase}/${slug}/${locale}.mdx`);
  const fileContents = fs.readFileSync(itemPath, "utf8");
  const { content, data } = matter(fileContents);
  const meta = data as PostFrontmatter;

  return { slug, meta, content };
}

export function getAllPosts(pathBaseItems: string[], lang: string) {
  const slugs = fs.readdirSync(path.join(...pathBaseItems));

  const posts = slugs
    .map((slug) => getMDXContentBySlug(pathBaseItems.join("/"), slug, lang))
    .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1));

  return posts;
}

export function getMDXPageComponents(
  componentList: string[],
  propList: string[],
  importList: string[]
) {
  const components: MDXPageDataStore = {};
  if (componentList) {
    for (const component of componentList) {
      components[component] = MDX_COMPONENTS[component];
    }
  }
  const props: MDXPageDataStore = {};
  if (propList) {
    for (const prop of propList) {
      props[prop] = MDX_PROPS[prop];
    }
  }
  const imports: MDXPageDataStore = {};
  if (importList) {
    for (const item of importList) {
      imports[item] = MDX_IMPORTS[item];
    }
  }
  return { components, props: { ...props, ...imports } };
}
