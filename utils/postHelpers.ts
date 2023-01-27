import fs from "fs";
import matter from "gray-matter";
import path from "path";

export interface PostFrontmatter {
  title: string;
  date: string;
  keywords: string;
  description: string;
  slug: string;
}

export interface PostData {
  slug: string;
  meta: PostFrontmatter;
  content: string;
}

export const POST_DATE_OPTS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export function getPostBySlug(slug: string, locale = "en"): PostData {
  const itemPath = path.join(`content/news/${slug}/${locale}.mdx`);
  const fileContents = fs.readFileSync(itemPath, "utf8");
  const { content, data } = matter(fileContents);
  const meta = data as PostFrontmatter;

  return { slug, meta, content };
}

export function getAllPosts(lang: string) {
  const slugs = fs.readdirSync(path.join("content", "news"));

  const posts = slugs
    .map((slug) => getPostBySlug(slug, lang))
    .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1));

  return posts;
}
