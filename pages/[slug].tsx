import type { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper, Typography } from "@mui/material";
import fs from "fs";
import path from "path";
import type { SupportedLocale } from "types/i18next";
import { type CompiledMDXData, getMDXPagePaths } from "utils/mdxPageHelpers";
import {
  getMDXContentBySlug,
  getMDXPageComponents,
} from "utils/mdxPageHelpers";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export default function Page({
  page,
}: {
  locale: SupportedLocale;
  page: CompiledMDXData;
}) {
  const {
    meta: { title, componentList = [], propsList = [], importsList = [] },
    content,
  } = page;

  const { components, props } = getMDXPageComponents({
    componentList,
    propsList,
    importsList,
  });

  return (
    <PageContainer>
      <Paper elevation={1} sx={{ py: 3, px: 4 }}>
        <Typography variant="h2" component="h1">
          {title}
        </Typography>

        <MDXRemote
          compiledSource={content.compiledSource}
          components={components}
          scope={props}
        />
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
  const page = getMDXContentBySlug("content/pages", dirSlug, locale);

  const content = await serialize(page.content);

  return {
    props: {
      page: {
        ...page,
        content,
      },
      ...i18nProps.props,
    },
  };
};

export const getStaticPaths: GetStaticPaths = ({ locales }) => {
  const dirnames = fs.readdirSync(path.join("content", "pages"));

  const paths = getMDXPagePaths(dirnames, locales as SupportedLocale[]);

  return {
    paths,
    fallback: false,
  };
};
