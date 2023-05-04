/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
// TODO: Page! Is currently rough frame receiving API data, functionality and display incomplete.
import React, { useEffect, useState } from "react";
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
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
// import TableView from "features/tableView/TableView";
import type { PagedResponse } from "types/api/common";
import { DbApi } from "utils/api/dbApi";
import type { SearchPageData } from "utils/api/search";
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

export default function SearchPage() {
  const { sourceLanguage, fileName } = useDbQueryParams();
  const { isFallback } = useSourceFile();

  const [searchTerm, setSearchTerm] = useState(
    "desessāmi asaṅkhatagāmiñca maggaṁ"
  );

  useEffect(() => {}, [searchTerm]);

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleSearch = () => {
    // TODO: handle search logic here
  };

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    isInitialLoading,
    isLoading,
  } = useInfiniteQuery<PagedResponse<SearchPageData>>({
    queryKey: DbApi.TableView.makeQueryKey(fileName),
    queryFn: ({ pageParam = 0 }) =>
      DbApi.GlobalSearchData.call({ searchTerm, pageNumber: pageParam }),
    getNextPageParam: (lastPage) => lastPage.pageNumber + 1,
    getPreviousPageParam: (lastPage) =>
      lastPage.pageNumber === 0 ? lastPage.pageNumber : lastPage.pageNumber - 1,
  });

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
          <Typography>{data?.pages[0].data.size} Results</Typography>
          <Grid
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            container
          >
            <ul>
              {[...(data?.pages[0].data.values() || [])].map((item) => (
                <li key={item.id}>
                  <Typography variant="h3" component="h2">
                    {item.id}
                  </Typography>
                </li>
              ))}
            </ul>
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
