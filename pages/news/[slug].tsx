import type { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { Link } from "@components/common/Link";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Paper, Typography } from "@mui/material";
import fs from "fs";
import path from "path";
import type { SupportedLocale } from "types/i18next";
import type { CompiledMDXData } from "utils/mdxPageHelpers";
import {
  getMDXContentBySlug,
  getMDXPageComponents,
  POST_DATE_OPTS,
} from "utils/mdxPageHelpers";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export default function PostPage({
  locale,
  post,
}: {
  locale: SupportedLocale;
  post: CompiledMDXData;
}) {
  const { t } = useTranslation();

  const { meta, content } = post;

  const date = new Date(meta.date);
  const pubDate = date.toLocaleDateString(locale, POST_DATE_OPTS);

  const { components, props } = getMDXPageComponents(
    meta.components ?? [],
    meta.props ?? [],
    meta.imports ?? []
  );

  return (
    <PageContainer>
      <Paper elevation={1} sx={{ py: 3, px: 4 }}>
        <Link route="/news">
          <Typography variant="body1" display="flex" alignItems="center">
            <ArrowBackIosIcon fontSize="small" />
            {t("common:news.backToNews")}
          </Typography>
        </Link>
        <article style={{ width: "100%" }}>
          <Typography variant="h2" component="h1" mt={4}>
            {meta.title}
          </Typography>
          <Typography variant="subtitle1">{pubDate}</Typography>

          <MDXRemote
            compiledSource={content.compiledSource}
            components={components}
            scope={props}
          />
        </article>
      </Paper>
      <Footer />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  if (!params) {
    throw new Error("🙀 No params!");
  }

  const i18nProps = await getI18NextStaticProps(
    {
      locale,
    },
    ["common"]
  );

  const dirSlug = params.slug as string;
  const post = getMDXContentBySlug("content/news", dirSlug, locale);

  const content = await serialize(post.content);

  return {
    props: {
      post: {
        ...post,
        content,
      },
      locale,
      ...i18nProps.props,
    },
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
