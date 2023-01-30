import type { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { Link } from "@components/common/Link";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import type { SupportedLocale } from "types/next-i18next";
import type { MDXData } from "utils/mdxPageHelpers";
import { getAllPosts, POST_DATE_OPTS } from "utils/mdxPageHelpers";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

const PostArchive = ({
  locale,
  posts,
}: {
  locale: SupportedLocale;
  posts: MDXData[];
}) => {
  const { t } = useTranslation();

  return (
    <Box width="100%">
      <List>
        {posts.map((post) => {
          const { title, date: d, description } = post.meta;

          const dirSlug: string = post.slug;

          const date = new Date(d);
          const pubDate = date.toLocaleDateString(locale, POST_DATE_OPTS);

          return (
            <ListItem key={dirSlug} sx={{ mb: 5 }} disablePadding>
              <article style={{ width: "100%" }}>
                <Typography variant="h4" component="h2">
                  <Link route={`/${dirSlug}`}>{title}</Link>
                </Typography>
                <Typography variant="subtitle1" component="p">
                  {pubDate}
                </Typography>
                <Typography variant="body1">{description}</Typography>

                <Link route={`/${dirSlug}`}>
                  <Typography
                    variant="body1"
                    display="flex"
                    alignItems="center"
                  >
                    {t("common:news.readMore")}
                  </Typography>
                </Link>
              </article>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default function NewsPage({
  locale,
  allPosts,
}: {
  locale: SupportedLocale;
  allPosts: any;
}) {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <Paper elevation={1} sx={{ py: 3, px: 4 }}>
        <Typography variant="h1" component="h1" mb={3}>
          {t("common:news.title")}
        </Typography>
        <PostArchive posts={allPosts} locale={locale} />
      </Paper>
      <Footer />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18nProps = await getI18NextStaticProps(
    {
      locale,
    },
    ["common"]
  );

  const allPosts = getAllPosts(["content", "news"], locale!);

  return {
    props: { allPosts, locale, ...i18nProps.props },
  };
};
