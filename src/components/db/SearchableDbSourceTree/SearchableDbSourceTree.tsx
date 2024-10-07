import React, { memo, useState } from "react";
import useDimensions from "react-cool-dimensions";
import { useTranslation } from "next-i18next";
import {
  activeDbSourceTreeAtom,
  activeDbSourceTreeBreadcrumbsAtom,
} from "@atoms";
import type { DbSourceTreeNode } from "@components/db/SearchableDbSourceTree/types";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import SearchIcon from "@mui/icons-material/Search";
import { Box, FormControl, InputAdornment, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { useAtomValue, useSetAtom } from "jotai";

import { DbSourceTree } from "./treeComponents/DbSourceTree";
import { LoadingTree } from "./treeComponents/LoadingTree";
import { TreeException } from "./treeComponents/TreeException";
import { TreeHeading } from "./treeComponents/TreeHeading";
import { TreeNavigation } from "./TreeNavigation";
import {
  BrowserTreeProps,
  DbSourceFilterSelectorTreeProps,
  DbSourceTreeType,
} from "./types";

type SearchableDbSourceTreeBaseProps = {
  parentHeight: number;
  parentWidth: number;
  hasHeading?: boolean;
  padding?: number;
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
      padding = 2,
      ...treeTypeProps
    } = props;

    const [searchTerm, setSearchTerm] = useState("");
    const { sourceLanguage } = useDbQueryParams();
    const { observe, height: inputHeight } = useDimensions();

    const activeTree = useAtomValue(activeDbSourceTreeAtom);
    const setBreacrumbs = useSetAtom(activeDbSourceTreeBreadcrumbsAtom);

    const handleSearchChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);

        if (value) {
          activeTree?.setSelection({
            ids: null,
            anchor: null,
            mostRecent: activeTree.mostRecentNode,
          });
          setBreacrumbs([]);
        }
      },
      [setSearchTerm, setBreacrumbs, activeTree],
    );

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
          padding={padding}
        />
      );
    }

    if (isError || !data) {
      return (
        <TreeException
          hasHeading={hasHeading}
          sourceLanguage={sourceLanguage}
          padding={padding}
          message={error ? error.message : t("prompts.noResults")}
        />
      );
    }

    return (
      <>
        <TreeHeading isRendered={hasHeading} sourceLanguage={sourceLanguage} />

        <Box ref={observe} sx={{ p: padding, pb: 0 }}>
          {/* Search input */}
          <FormControl variant="outlined" fullWidth>
            <TextField
              label="Search"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearchChange}
            />
          </FormControl>

          <TreeNavigation type={treeTypeProps.type} />
        </Box>

        {/* Tree view - text browser */}
        <Box sx={{ pl: padding }}>
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
