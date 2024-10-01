import { memo, useState } from "react";
import useDimensions from "react-cool-dimensions";
import { useTranslation } from "next-i18next";
import { activeDbSourceBrowserTreeAtom } from "@atoms";
import type { DbSourceTreeNode } from "@components/db/SearchableDbSourceTree/types";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { useAtomValue } from "jotai";

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

    const { t } = useTranslation(["common"]);

    const activeTree = useAtomValue(activeDbSourceBrowserTreeAtom);

    const { data, isLoading, isError, error } = useQuery<DbSourceTreeNode[]>({
      queryKey: DbApi.DbSourcesMenu.makeQueryKey(sourceLanguage),
      queryFn: () => DbApi.DbSourcesMenu.call({ language: sourceLanguage }),
    });

    if (isLoading) {
      return (
        <LoadingTree
          hasHeading={hasHeading}
          sourceLanguage={sourceLanguage}
          px={padding}
        />
      );
    }

    if (isError || !data) {
      return (
        <TreeException
          hasHeading={hasHeading}
          sourceLanguage={sourceLanguage}
          px={padding}
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
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </FormControl>

          <Box
            display="flex"
            justifyContent="flex-end"
            gap="0.5rem"
            mt={treeTypeProps.type === DbSourceTreeType.Browser ? 2 : 1}
          >
            <IconButton size="small" onClick={() => activeTree?.openAll()}>
              <AddIcon color="action" />
            </IconButton>

            <IconButton size="small" onClick={() => activeTree?.closeAll()}>
              <RemoveIcon color="action" />
            </IconButton>
          </Box>
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
