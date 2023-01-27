import type { GetStaticProps } from "next";
import Link from "next/link";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper, Typography } from "@mui/material";
import fs from "fs";
import matter from "gray-matter";
import path from "path";

const PostArchive = ({ locale, posts }) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <ul>
      {posts.map((post) => {
        const { slug, title, date: d, description } = post.meta;

        const date = new Date(d);
        const pubDate = date.toLocaleDateString(locale, options);

        return (
          <li key={slug}>
            <article>
              <Typography variant="h3" component="h2">
                <Link as={`/news/${slug}`} href="/news/[slug]">
                  {title}
                </Link>
              </Typography>
              <Typography variant="subtitle1">{pubDate}</Typography>
              <Typography variant="body1">{description}</Typography>
              <div>
                <Link as={`/news/${slug}`} href="/news/[slug]">
                  {/* {t("posts-read-more")} <Icon name="arrowright" /> */}
                  Read more
                </Link>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
};

export default function NewsPage({ allPosts, locale }) {
  return (
    <PageContainer>
      <Paper elevation={1} sx={{ py: 3, px: 4 }}>
        <Typography variant="h1" component="h1">
          News
        </Typography>
        <PostArchive posts={allPosts} locale={locale} />
      </Paper>
      <Footer />
    </PageContainer>
  );
}

function getPostBySlug(slug: string, locale = "en") {
  const itemPath = path.join(`content/news/${slug}/${locale}.mdx`);
  const fileContents = fs.readFileSync(itemPath, "utf8");
  const { content, data } = matter(fileContents);

  return { slug, meta: data, content };
}

function getAllPosts(lang: string) {
  const slugs = fs.readdirSync(path.join("content", "news"));

  const posts = slugs
    .map((slug) => getPostBySlug(slug, lang))
    .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1));
  return posts;
}

export const getStaticProps: GetStaticProps = ({ locale }) => {
  const allPosts = getAllPosts(locale!);

  return {
    props: { allPosts, locale },
  };
};
