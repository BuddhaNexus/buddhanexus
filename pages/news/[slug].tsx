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
import type { SupportedLocale } from "types/next-i18next";
import type { CompiledMDXData } from "utils/mdxPageHelpers";
import { getMDXContentBySlug, POST_DATE_OPTS } from "utils/mdxPageHelpers";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export default function PostPage({
  locale,
  post,
}: {
  locale: SupportedLocale;
  post: CompiledMDXData;
}) {
  const { t } = useTranslation();

  const {
    meta: { title, date: d },
    content,
  } = post;

  const date = new Date(d);
  const pubDate = date.toLocaleDateString(locale, POST_DATE_OPTS);

  return (
    <PageContainer>
      <Paper elevation={1} sx={{ py: 3, px: 4 }}>
        <Link route="/news">
          <Typography variant="body1" display="flex" alignItems="center">
            <ArrowBackIosIcon fontSize="small" />
            {t("common:news.backToNews")}
          </Typography>
        </Link>

        <Typography variant="h2" component="h1" mt={4}>
          {title}
        </Typography>
        <Typography variant="subtitle1">{pubDate}</Typography>

        <MDXRemote compiledSource={content.compiledSource} />
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

  const slug = params.slug as string;
  const post = getMDXContentBySlug("content/news", slug, locale);

  const content = await serialize(post.content);

  return {
    props: {
      post: {
        ...post,
        content,
      },
      ...i18nProps.props,
    },
  };

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
