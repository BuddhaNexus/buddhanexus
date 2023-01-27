import { useMemo } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import { Link } from "@components/common/Link";
import { AppMDXComponents } from "@components/layout/AppMDXComponents";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper, Typography } from "@mui/material";
import fs from "fs";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import path from "path";
import type { SupportedLocale } from "types/next-i18next";
import type { PostData } from "utils/postHelpers";
import { getPostBySlug, POST_DATE_OPTS } from "utils/postHelpers";

export default function PostPage({
  locale,
  post,
}: {
  locale: SupportedLocale;
  post: PostData;
}) {
  const { title, date: d } = post.meta;

  const date = new Date(d);
  const pubDate = date.toLocaleDateString(locale, POST_DATE_OPTS);
  const PostContent = useMemo(
    () => getMDXComponent(post.content),
    [post.content]
  );

  return (
    <PageContainer>
      <Paper elevation={1} sx={{ py: 3, px: 4 }}>
        {/* TODO: localize */}
        <Link route="/news">{"< Back to News"}</Link>

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
