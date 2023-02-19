import { memo, useState } from "react";
import { Tree } from "react-arborist";
import useDimensions from "react-cool-dimensions";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Node } from "@components/treeView/DrawerNavigationComponents";
import type { DrawerNavigationNodeData } from "@components/treeView/types";
import SearchIcon from "@mui/icons-material/Search";
import {
  Backdrop,
  Box,
  CircularProgress,
  FormControl,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "utils/api/dbApi";

// https://github.com/brimdata/react-arborist
const TreeViewContent = memo(function TreeViewContent({
  data,
  height,
  width,
  searchTerm,
}: {
  data: DrawerNavigationNodeData[];
  height: number;
  width: number;
  searchTerm?: string;
}) {
  return (
    <Tree
      searchTerm={searchTerm}
      initialData={data}
      openByDefault={false}
      disableDrag={true}
      rowHeight={60}
      disableDrop={true}
      disableEdit={true}
      padding={12}
      height={height}
      width={width}
    >
      {Node}
    </Tree>
  );
});

interface Props {
  parentHeight: number;
  parentWidth: number;
}

export const SourceTextBrowserTree = memo<Props>(
  function SourceTextBrowserTree({ parentHeight, parentWidth }) {
    const [searchTerm, setSearchTerm] = useState("");
    const { sourceLanguage } = useDbQueryParams();
    const { observe, height: inputHeight } = useDimensions();

    // TODO: add error handling
    const { data, isLoading } = useQuery<DrawerNavigationNodeData[]>({
      queryKey: DbApi.SidebarSourceTexts.makeQueryKey(sourceLanguage),
      queryFn: () => DbApi.SidebarSourceTexts.call(sourceLanguage),
    });

    const hasData = !(isLoading || !data);

    return (
      <>
        {hasData && (
          <>
            {/* Search input */}
            <FormControl
              ref={observe}
              variant="outlined"
              sx={{ p: 2, pb: 0 }}
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
            <Box sx={{ pl: 2 }}>
              <TreeViewContent
                data={data}
                height={parentHeight - inputHeight}
                width={parentWidth}
                searchTerm={searchTerm}
              />
            </Box>
          </>
        )}

        <Backdrop open={!hasData}>
          <CircularProgress />
        </Backdrop>
      </>
    );
  }
);
