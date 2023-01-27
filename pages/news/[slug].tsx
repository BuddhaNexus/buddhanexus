import { useMemo } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { AppMDXComponents } from "@components/layout/AppMDXComponents";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper, Typography } from "@mui/material";
import fs from "fs";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import path from "path";

export default function PostPage({ locale, post }) {
  // const router = useRouter();

  const { title, date: d } = post.meta;
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(d);
  const pubDate = date.toLocaleDateString(locale, options);
  const PostContent = useMemo(
    () => getMDXComponent(post.content),
    [post.content]
  );

  return (
    <PageContainer>
      <Paper elevation={1} sx={{ py: 3, px: 4 }}>
        <Link as="/news/" href="/news/">
          {"< Back to News"}
        </Link>

        <Typography variant="h2" component="h1">
          {title}
        </Typography>
        <Typography variant="subtitle1">{pubDate}</Typography>
        <PostContent components={AppMDXComponents} />
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

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  if (params) {
    const slug = params.slug as string;

    const post = getPostBySlug(slug, locale);

    const result = await bundleMDX({ source: post.content });
    const { code: content } = result;
    return {
      props: {
        locale,
        post: {
          ...post,
          content,
        },
      },
    };
  }

  return {
    props: { error: true },
  };
};

export const getStaticPaths: GetStaticPaths = ({ locales }) => {
  const dirnames = fs.readdirSync(path.join("content", "news"));

  type Path = { params: { slug: string }; locale: string };
  const paths: Path[] = [];

  for (const dir of dirnames) {
    for (const locale of locales!) {
      paths.push({ params: { slug: dir }, locale });
    }
  }

  return {
    paths,
    fallback: false,
  };
};
