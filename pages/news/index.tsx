import type { GetStaticProps } from "next";
import Link from "next/link";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper, Typography } from "@mui/material";
import routes from "routes";
import type { SupportedLocale } from "types/next-i18next";
import type { PostData } from "utils/postHelpers";
import { getAllPosts, POST_DATE_OPTS } from "utils/postHelpers";

const PostArchive = ({
  locale,
  posts,
}: {
  locale: SupportedLocale;
  posts: PostData[];
}) => {
  return (
    <ul>
      {posts.map((post) => {
        const { slug, title, date: d, description } = post.meta;

        const date = new Date(d);
        const pubDate = date.toLocaleDateString(locale, POST_DATE_OPTS);

        return (
          <li key={slug}>
            <article>
              <Typography variant="h3" component="h2">
                <Link href={`${routes.news[locale]}/${slug}`}>{title}</Link>
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

export default function NewsPage({
  locale,
  allPosts,
}: {
  locale: SupportedLocale;
  allPosts: any;
}) {
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

export const getStaticProps: GetStaticProps = ({ locale }) => {
  const allPosts = getAllPosts(locale!);

  return {
    props: { allPosts, locale },
  };
};
