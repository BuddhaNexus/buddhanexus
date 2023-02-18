import { memo, useMemo } from "react";
import type { NodeApi, NodeRendererProps } from "react-arborist";
import { Tree } from "react-arborist";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { NodeDataChildType } from "@components/treeView/types";
import { transformDataForTreeView } from "@components/treeView/utils";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { SourceTextBrowserData } from "types/api/sourceTextBrowser";
import { DbApi } from "utils/api/dbApi";

type NodeData = {
  id: string;
  name: string;
  fileName?: string;
  availableLanguages?: string | null;
  dataType?: NodeDataChildType;
};

function FolderArrow({ node }: { node: NodeApi<NodeData> }) {
  if (node.isInternal) {
    return node.isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />;
  }
  return null;
}

function Node({ node, style, dragHandle }: NodeRendererProps<NodeData>) {
  const { dataType, name } = node.data;
  return (
    <Box
      ref={dragHandle}
      style={style}
      sx={{ display: "flex", alignItems: "center", fontSize: 18 }}
      onClick={() => node.isInternal && node.toggle()}
    >
      <FolderArrow node={node} />
      {dataType === NodeDataChildType.Collection && (
        <LibraryBooksIcon fontSize="inherit" />
      )}
      {dataType === NodeDataChildType.Category && (
        <MenuBookIcon fontSize="inherit" />
      )}
      <Tooltip
        title={<Typography>{name}</Typography>}
        PopperProps={{ disablePortal: true }}
        disableHoverListener={name.length < 30}
      >
        <Typography
          textOverflow="ellipsis"
          fontSize="inherit"
          whiteSpace="nowrap"
          sx={{ px: 1 }}
          fontWeight={dataType === NodeDataChildType.Collection ? 600 : 400}
        >
          {name}
        </Typography>
      </Tooltip>
    </Box>
  );
}

// https://github.com/brimdata/react-arborist
const TreeViewContent = memo(function TreeViewContent({
  data,
  height,
}: {
  data: SourceTextBrowserData;
  height: number;
}) {
  // expensive operation - memoise the result for better performance on subsequent renders
  const treeData = useMemo(() => transformDataForTreeView(data), [data]);

  return (
    <Tree
      initialData={treeData}
      openByDefault={false}
      disableDrag={true}
      rowHeight={30}
      disableDrop={true}
      disableEdit={true}
      padding={12}
      height={height}
      width={400}
    >
      {Node}
    </Tree>
  );
});

export const SourceTextBrowserTree = memo(function SourceTextBrowserTree({
  height,
}: {
  height: number;
}) {
  const { sourceLanguage } = useDbQueryParams();

  // TODO: add error handling
  const { data, isLoading } = useQuery<SourceTextBrowserData>({
    queryKey: DbApi.SidebarSourceTexts.makeQueryKey(sourceLanguage),
    queryFn: () => DbApi.SidebarSourceTexts.call(sourceLanguage),
  });

  return isLoading || !data ? (
    <CircularProgress />
  ) : (
    <TreeViewContent data={data} height={height} />
  );
});
