import React, { memo, useState } from "react";
import useDimensions from "react-cool-dimensions";
import { useTranslation } from "next-i18next";
import {
  activeDbSourceTreeAtom,
  activeDbSourceTreeBreadcrumbsAtom,
} from "@atoms";
import type { DbSourceTreeNode } from "@components/db/SearchableDbSourceTree/types";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
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
    | ({ type: DbSourceTreeType.BROWSER } & BrowserTreeProps)
    | ({
        type: DbSourceTreeType.FILTER_SELECTOR;
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
    const { dbLanguage } = useDbRouterParams();
    const { observe, height: inputHeight } = useDimensions();

    const activeTree = useAtomValue(activeDbSourceTreeAtom);
    const setBreadcrumbs = useSetAtom(activeDbSourceTreeBreadcrumbsAtom);

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
          setBreadcrumbs([]);
        }
      },
      [setSearchTerm, setBreadcrumbs, activeTree],
    );

    const { t } = useTranslation(["common"]);

    const { data, isLoading, isError, error } = useQuery<DbSourceTreeNode[]>({
      queryKey: DbApi.DbSourcesMenu.makeQueryKey(dbLanguage),
      queryFn: () => DbApi.DbSourcesMenu.call({ language: dbLanguage }),
    });

    if (isLoading) {
      return (
        <LoadingTree
          hasHeading={hasHeading}
          dbLanguage={dbLanguage}
          padding={padding}
          width={parentWidth}
        />
      );
    }

    if (isError || !data) {
      return (
        <TreeException
          hasHeading={hasHeading}
          dbLanguage={dbLanguage}
          padding={padding}
          message={error ? error.message : t("prompts.noResults")}
          width={parentWidth}
          height={parentHeight}
        />
      );
    }

    return (
      <>
        <TreeHeading isRendered={hasHeading} dbLanguage={dbLanguage} />

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
