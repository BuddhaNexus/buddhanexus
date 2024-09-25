import { memo, useState } from "react";
import useDimensions from "react-cool-dimensions";
import { useTranslation } from "next-i18next";
import type { SourceTextTreeNode } from "@components/db/SourceTextTree/types";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import SearchIcon from "@mui/icons-material/Search";
import { Box, FormControl, InputAdornment, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "utils/api/dbApi";

import {
  LoadingTree,
  TreeException,
  TreeHeading,
  TreeViewContent,
  type TreeViewContentType,
  type TreeViewSelectProps,
} from "./TreeBaseComponents";

interface SourceTextTreeBaseProps {
  parentHeight: number;
  parentWidth: number;
  type?: TreeViewContentType;
  hasHeading?: boolean;
  px?: number;
}

type SourceTextTreeProps =
  | ({ type: "browse" } & SourceTextTreeBaseProps)
  | ({ type: "select" } & SourceTextTreeBaseProps & TreeViewSelectProps);

export const SourceTextTree = memo<SourceTextTreeProps>(
  function SourceTextTree(props) {
    const {
      parentHeight,
      parentWidth,
      hasHeading = true,
      px = 2,
      ...treeProps
    } = props;

    const [searchTerm, setSearchTerm] = useState("");
    const { sourceLanguage } = useDbQueryParams();
    const { observe, height: inputHeight } = useDimensions();

    const { t } = useTranslation(["common"]);

    const { data, isLoading, isError, error } = useQuery<SourceTextTreeNode[]>({
      queryKey: DbApi.SidebarSourceTexts.makeQueryKey(sourceLanguage),
      queryFn: () =>
        DbApi.SidebarSourceTexts.call({ language: sourceLanguage }),
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
          <TreeViewContent
            data={data}
            height={parentHeight - inputHeight}
            width={parentWidth}
            searchTerm={searchTerm}
            {...treeProps}
          />
        </Box>
      </>
    );
  },
);
