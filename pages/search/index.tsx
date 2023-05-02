import React, { useState } from "react";
import type { GetStaticProps } from "next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import { Close, Search } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// import { useInfiniteQuery } from "@tanstack/react-query";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
// import TableView from "features/tableView/TableView";
// import type { PagedResponse } from "types/api/common";
// import { DbApi } from "utils/api/dbApi";
// import { ALL_LOCALES, SourceLanguage } from "utils/constants";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

const StyledForm = styled("form")(({ theme }) => ({
  marginBottom: theme.spacing(5),
  borderRadius: "4px",
  border: `1px solid ${theme.palette.primary.main}`,
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  // fullwidth minus icons
  width: "calc(100% - 96px)",
  height: "60px",
  marginLeft: theme.spacing(1),
  fontSize: "20px",
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function TablePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sourceLanguage, fileName } = useDbQueryParams();
  const { isFallback } = useSourceFile();

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading] = useState(false);

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleSearch = () => {
    // TODO: handle search logic here
    return null;
  };

  // TODO: add error handling
  //   const { data, fetchNextPage, fetchPreviousPage, isInitialLoading } =
  //     useInfiniteQuery<PagedResponse<TablePageData>>({
  //       queryKey: DbApi.TableView.makeQueryKey(fileName),
  //       queryFn: ({ pageParam = 0 }) => DbApi.TableView.call(fileName, pageParam),
  //       getNextPageParam: (lastPage) => lastPage.pageNumber + 1,
  //       getPreviousPageParam: (lastPage) =>
  //         lastPage.pageNumber === 0
  //           ? lastPage.pageNumber
  //           : lastPage.pageNumber - 1,
  //     });

  if (isFallback) {
    return (
      <PageContainer maxWidth="xl" backgroundName={sourceLanguage}>
        <CircularProgress color="inherit" sx={{ flex: 1 }} />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="xl" backgroundName={sourceLanguage}>
      <StyledForm>
        <IconButton aria-label="search">
          <Search />
        </IconButton>
        <SearchInput
          placeholder="Enter search term"
          value={searchTerm}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <IconButton aria-label="close" onClick={() => setSearchTerm("")}>
          <Close />
        </IconButton>
      </StyledForm>

      {!searchTerm && <Typography>No results.</Typography>}

      {isLoading && <CircularProgress />}

      {searchTerm && !isLoading && (
        <>
          <Typography>4 Results</Typography>
          <Grid
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            container
          >
            <Grid xs={6} item>
              <Item>Placeholder Item 1</Item>
            </Grid>
            <Grid xs={6} item>
              <Item>Placeholder Item 2</Item>
            </Grid>
            <Grid xs={6} item>
              <Item>Placeholder Item 3</Item>
            </Grid>
            <Grid xs={6} item>
              <Item>Placeholder Item 4</Item>
            </Grid>
          </Grid>
        </>
      )}

      <SourceTextBrowserDrawer />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18nProps = await getI18NextStaticProps(
    {
      locale,
    },
    ["db"]
  );

  return {
    props: {
      ...i18nProps.props,
    },
  };
};
