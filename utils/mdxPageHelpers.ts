import fs from "fs";
import matter from "gray-matter";
import path from "path";

export interface PostFrontmatter {
  title: string;
  date: string;
  keywords: string;
  description: string;
  slug: string;
  components?: string[];
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
