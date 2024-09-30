import { memo, useState } from "react";
import useDimensions from "react-cool-dimensions";
import { useTranslation } from "next-i18next";
import type { DbSourceTreeNode } from "@components/db/SearchableDbSourceTree/types";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import SearchIcon from "@mui/icons-material/Search";
import { Box, FormControl, InputAdornment, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "utils/api/dbApi";

import { DbSourceTree } from "./treeComponents/DbSourceTree";
import { LoadingTree } from "./treeComponents/LoadingTree";
import { TreeException } from "./treeComponents/TreeException";
import { TreeHeading } from "./treeComponents/TreeHeading";
import {
  BrowserTreeProps,
  DbSourceFilterSelectorTreeProps,
  DbSourceTreeType,
} from "./types";

type SearchableDbSourceTreeBaseProps = {
  parentHeight: number;
  parentWidth: number;
  hasHeading?: boolean;
  px?: number;
};

type SearchableDbSourceTreeProps = SearchableDbSourceTreeBaseProps &
  (
    | ({ type: DbSourceTreeType.Browser } & BrowserTreeProps)
    | ({
        type: DbSourceTreeType.FilterSelector;
      } & DbSourceFilterSelectorTreeProps)
  );

export const SearchableDbSourceTree = memo<SearchableDbSourceTreeProps>(
  function SearchableDbSourceTree(props) {
    const {
      parentHeight,
      parentWidth,
      hasHeading = true,
      px = 2,
      ...treeTypeProps
    } = props;

    const [searchTerm, setSearchTerm] = useState("");
    const { sourceLanguage } = useDbQueryParams();
    const { observe, height: inputHeight } = useDimensions();

    const { t } = useTranslation(["common"]);

    const { data, isLoading, isError, error } = useQuery<DbSourceTreeNode[]>({
      queryKey: DbApi.DbSourcesMenu.makeQueryKey(sourceLanguage),
      queryFn: () => DbApi.DbSourcesMenu.call({ language: sourceLanguage }),
    });

    if (isLoading) {
      return (
        <LoadingTree
          hasHeading={hasHeading}
          sourceLanguage={sourceLanguage}
          px={px}
        />
      );
    }

    if (isError || !data) {
      return (
        <TreeException
          hasHeading={hasHeading}
          sourceLanguage={sourceLanguage}
          px={px}
          message={error ? error.message : t("prompts.noResults")}
        />
      );
    }

    return (
      <>
        <TreeHeading isRendered={hasHeading} sourceLanguage={sourceLanguage} />

        {/* Search input */}
        <FormControl
          ref={observe}
          variant="outlined"
          sx={{ px, pt: 2, pb: 0 }}
          fullWidth
        >
          <TextField
            label="Search"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </FormControl>

        {/* Tree view - text browser */}
        <Box sx={{ pl: px }}>
          <DbSourceTree
            data={data}
            height={parentHeight - inputHeight}
            width={parentWidth}
            searchTerm={searchTerm}
            {...treeTypeProps}
          />
        </Box>
      </>
    );
  },
);
