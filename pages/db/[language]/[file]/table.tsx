import { DbViewSelector } from "@components/db/DbViewSelector";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import { CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { ApiTablePageData } from "types/api";
import { DbApi } from "utils/api/db";

export {
  getSourceTextStaticPaths as getStaticPaths,
  getI18NextStaticProps as getStaticProps,
} from "utils/nextJsHelpers";

export default function TablePage() {
  const { sourceLanguageName, sourceLanguage, fileName } = useDbQueryParams();
  const { sourceFile, isFallback } = useSourceFile();

  // TODO: add error handling
  const { data, isLoading } = useQuery<ApiTablePageData>({
    queryKey: DbApi.TableView.makeQueryKey(fileName),
    queryFn: () => DbApi.TableView.call(fileName),
  });

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

      {isLoading ? (
        <CircularProgress color="inherit" />
      ) : (
        data?.map((item) => (
          <Typography key={item.file_name}>{JSON.stringify(item)}</Typography>
        ))
      )}
    </PageContainer>
  );
}
