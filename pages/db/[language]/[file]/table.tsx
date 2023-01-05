import { DbViewSelector } from "@components/db/DbViewSelector";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import { CircularProgress, Typography } from "@mui/material";

export {
  getSourceTextStaticPaths as getStaticPaths,
  getI18NextStaticProps as getStaticProps,
} from "utils/nextJsHelpers";

// https://buddhanexus.kc-tbts.uni-hamburg.de/api/files/dn3/table?co_occ=2000&sort_method=position&folio=

export default function TablePage() {
  const { sourceLanguageName, sourceLanguage } = useDbQueryParams();
  const { sourceFile, isFallback } = useSourceFile();

  if (isFallback) {
    return (
      <PageContainer backgroundName={sourceLanguage}>
        <CircularProgress color="inherit" />
      </PageContainer>
    );
  }

  return (
    <PageContainer backgroundName={sourceLanguage}>
      <DbViewSelector currentView="table" />
      <Typography variant="h2">
        File: {sourceFile} in {sourceLanguageName}
      </Typography>
    </PageContainer>
  );
}
