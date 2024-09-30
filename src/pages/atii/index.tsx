import { Link } from "@components/common/Link";
import { PageContainer } from "@components/layout/PageContainer";
import { Typography } from "@mui/material";

export { getI18NextStaticProps as getStaticProps } from "@utils/nextJsHelpers";

export default function AtiiIndex() {
  return (
    <PageContainer>
      <Typography variant="h1">ATII Home</Typography>
      <Link href="/atii/sample-page" variant="h5">
        Sample sub-page
      </Link>
    </PageContainer>
  );
}
