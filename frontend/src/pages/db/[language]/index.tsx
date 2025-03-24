import React from "react";
import type { GetStaticProps } from "next";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Box, Paper, Typography } from "@mui/material";
import { getI18NextStaticProps } from "@utils/nextJsHelpers";
import merge from "lodash/merge";

export { getDbLanguageStaticPaths as getStaticPaths } from "@utils/nextJsHelpers";

import useDimensions from "react-cool-dimensions";
import {
  DbSourceTreeType,
  SearchableDbSourceTree,
} from "@components/db/SearchableDbSourceTree";

export default function DbIndexPage() {
  const { dbLanguageName, dbLanguage } = useDbPageRouterParams();
  const { observe, height, width } = useDimensions();

  return (
    <PageContainer backgroundName={dbLanguage}>
      <Paper
        elevation={1}
        sx={{
          py: 3,
          px: 4,
          minHeight: "85dvh",
        }}
      >
        <Typography variant="h1">{dbLanguageName}</Typography>

        <Box
          ref={observe}
          sx={{
            height: "calc(100% - 5rem)",
            mt: 2,
          }}
        >
          <SearchableDbSourceTree
            type={DbSourceTreeType.BROWSER}
            parentHeight={height}
            parentWidth={width}
            hasHeading={false}
            padding={0}
          />
        </Box>
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
    ["db", "settings"],
  );

  return merge(i18nProps);
};
