import type { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { Link } from "@components/common/Link";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import LaunchIcon from "@mui/icons-material/Launch";
import MenuIcon from "@mui/icons-material/Menu";
import { Paper, Typography } from "@mui/material";
import Event from "components/static/Event";
import PartnerInstitution from "components/static/PartnerInstitution";
import fs from "fs";
import path from "path";
import type { SupportedLocale } from "types/next-i18next";
import type { CompiledMDXData } from "utils/mdxPageHelpers";
import { getMDXContentBySlug } from "utils/mdxPageHelpers";

type ComponentStore = Record<string, any>;

const mdxFileComponents: ComponentStore = {
  KeyboardDoubleArrowUpIcon,
  LaunchIcon,
  MenuIcon,
  Event,
  PartnerInstitution,
  Link,
};

export default function Page({
  page,
}: {
  locale: SupportedLocale;
  page: CompiledMDXData;
}) {
  const { meta, content } = page;

  const components: ComponentStore = {};
  if (meta.components) {
    for (const component of meta.components) {
      components[component] = mdxFileComponents[component];
    }
  }

  return (
    <PageContainer>
      <Paper elevation={1} sx={{ py: 3, px: 4 }}>
        <Typography variant="h2" component="h1">
          {meta.title}
        </Typography>

        <MDXRemote
          components={components}
          compiledSource={content.compiledSource}
        />
      </Paper>
      <Footer />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  if (params) {
    const slug = params.slug as string;
    const page = getMDXContentBySlug("content/pages", slug, locale);

    const content = await serialize(page.content);

    return {
      props: {
        locale,
        page: {
          ...page,
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
  const dirnames = fs.readdirSync(path.join("content", "pages"));

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
