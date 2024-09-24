import React from "react";
import type { GetStaticProps } from "next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Box, Paper, Typography } from "@mui/material";
// import { dehydrate } from "@tanstack/react-query";
import merge from "lodash/merge";
// import { prefetchDefaultDbPageData } from "utils/api/apiQueryUtils";
// import type { SourceLanguage } from "utils/constants";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export { getSourceLanguageStaticPaths as getStaticPaths } from "utils/nextJsHelpers";

import useDimensions from "react-cool-dimensions";
import { SourceTextBrowserTree } from "@components/treeView/SourceTextBrowserTree";

export default function DbIndexPage() {
  const { sourceLanguageName, sourceLanguage } = useDbQueryParams();
  const { observe, height, width } = useDimensions();

  return (
    <PageContainer backgroundName={sourceLanguage}>
      <Paper
        elevation={1}
        sx={{
          py: 3,
          px: 4,
          minHeight: "85dvh",
        }}
      >
        <Typography variant="h1">{sourceLanguageName}</Typography>

        <Box
          ref={observe}
          sx={{
            maxHeight: "70dvh",
          }}
        >
          <SourceTextBrowserTree
            parentHeight={height}
            parentWidth={width}
            renderHeading={false}
            px={0}
          />
        </Box>
      </Paper>
      <Footer />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({
  locale,
  // params
}) => {
  const i18nProps = await getI18NextStaticProps(
    {
      locale,
    },
    ["db", "settings"],
  );

  // const queryClient = await prefetchDefaultDbPageData(
  //   params?.language as SourceLanguage,
  // );

  return merge(
    // { props: { dehydratedState: dehydrate(queryClient) } },
    i18nProps,
  );
};
