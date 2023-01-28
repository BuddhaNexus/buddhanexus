import type { GetStaticProps } from "next";
import { Link } from "@components/common/Link";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper, Typography } from "@mui/material";
import type { SupportedLocale } from "types/next-i18next";
import type { MDXData } from "utils/mdxPageHelpers";
import { getAllPosts, POST_DATE_OPTS } from "utils/mdxPageHelpers";

const PostArchive = ({
  locale,
  posts,
}: {
  locale: SupportedLocale;
  posts: MDXData[];
}) => {
  return (
    <ul>
      {posts.map((post) => {
        const { title, date: d, description } = post.meta;

        const date = new Date(d);
        const pubDate = date.toLocaleDateString(locale, POST_DATE_OPTS);

        return (
          <li key={post.slug}>
            <article>
              <Typography variant="h3" component="h2">
                {/* TODO */}
                <Link route={`/${post.slug}`}>{title}</Link>
              </Typography>
              <Typography variant="subtitle1">{pubDate}</Typography>
              <Typography variant="body1">{description}</Typography>
              <div>
                <Link route={`/${post.slug}`}>
                  {/* TODO: {t("posts-read-more")} <Icon name="arrowright" /> */}
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
  const allPosts = getAllPosts(["content", "news"], locale!);

  return {
    props: { allPosts, locale },
  };
};
