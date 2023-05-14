import type { BackgroundName } from "@components/layout/PageContainer";
import { PageContainer } from "@components/layout/PageContainer";
import { Typography } from "@mui/material";

export function ErrorPage({
  backgroundName,
}: {
  backgroundName: BackgroundName;
}) {
  return (
    <PageContainer backgroundName={backgroundName}>
      <Typography variant="h1">Error</Typography>
      <Typography variant="h3" sx={{ py: 2 }}>
        Something went wrong.
      </Typography>
      <Typography variant="body1">
        Please check the console for details.
      </Typography>
    </PageContainer>
  );
}
