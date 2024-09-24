import { memo, useState } from "react";
import useDimensions from "react-cool-dimensions";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import type { DrawerNavigationNodeData } from "@components/treeView/types";
import SearchIcon from "@mui/icons-material/Search";
import { Box, FormControl, InputAdornment, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "utils/api/dbApi";

import {
  LoadingTree,
  TreeException,
  TreeHeading,
  TreeViewContent,
} from "./TreeBrowserComponents";

interface SourceTextBrowserTreeProps {
  parentHeight: number;
  parentWidth: number;
  renderHeading?: boolean;
  px?: number;
}

export const SourceTextBrowserTree = memo<SourceTextBrowserTreeProps>(
  function SourceTextBrowserTree({
    parentHeight,
    parentWidth,
    renderHeading = true,
    px = 2,
  }) {
    const [searchTerm, setSearchTerm] = useState("");
    const { sourceLanguage } = useDbQueryParams();
    const { observe, height: inputHeight } = useDimensions();

    const { t } = useTranslation(["common"]);

    const { data, isLoading, isError, error } = useQuery<
      DrawerNavigationNodeData[]
    >({
      queryKey: DbApi.SidebarSourceTexts.makeQueryKey(sourceLanguage),
      queryFn: () =>
        DbApi.SidebarSourceTexts.call({ language: sourceLanguage }),
    });

    if (isLoading) {
      return (
        <LoadingTree
          renderHeading={renderHeading}
          sourceLanguage={sourceLanguage}
          px={px}
        />
      );
    }

    if (isError || !data) {
      return (
        <TreeException
          renderHeading={renderHeading}
          sourceLanguage={sourceLanguage}
          px={px}
          message={error ? error.message : t("prompts.noResults")}
        />
      );
    }

    return (
      <>
        <TreeHeading
          isRendered={renderHeading}
          sourceLanguage={sourceLanguage}
        />

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
          <TreeViewContent
            data={data}
            height={parentHeight - inputHeight}
            width={parentWidth}
            searchTerm={searchTerm}
          />
        </Box>
      </>
    );
  },
);
