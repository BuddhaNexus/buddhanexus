import { useSourceLanguage } from "@components/hooks/useSourceLanguage";
import { PageContainer } from "@components/layout/PageContainer";
import { Typography } from "@mui/material";

export {
  getSourceLanguageStaticPaths as getStaticPaths,
  getI18NextStaticProps as getStaticProps,
} from "utils/common";

export default function SamplePage() {
  const { sourceLanguageName } = useSourceLanguage();

  return (
    <PageContainer>
      <Typography variant="h1">Table view for {sourceLanguageName}</Typography>
    </PageContainer>
  );
}
