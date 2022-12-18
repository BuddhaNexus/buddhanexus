import { PageContainer } from "@components/layout/PageContainer";
import { Typography } from "@mui/material";

export { getI18NextStaticProps as getStaticProps } from "utils/nextJsHelpers";

export default function SamplePage() {
  return (
    <PageContainer>
      <Typography variant="h1">Sample ATII page</Typography>
    </PageContainer>
  );
}
