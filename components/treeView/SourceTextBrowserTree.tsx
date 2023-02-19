import { memo, useMemo, useState } from "react";
import type { NodeApi, NodeRendererProps } from "react-arborist";
import { Tree } from "react-arborist";
import useDimensions from "react-cool-dimensions";
import { Link } from "@components/common/Link";
import { getTableViewUrl } from "@components/common/utils";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { NodeDataChildType } from "@components/treeView/types";
import { transformDataForTreeView } from "@components/treeView/utils";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ShortTextIcon from "@mui/icons-material/ShortText";
import {
  Box,
  CircularProgress,
  Input,
  Tooltip,
  Typography,
} from "@mui/material";
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
  const { dataType, name, fileName } = node.data;
  const { sourceLanguage } = useDbQueryParams();

  const handleClick = () => {
    if (node.isInternal) {
      node.toggle();
    }
    // const { dataType, fileName } = node.data;
    // if (dataType === NodeDataChildType.Text) {
    //   // rotue
    // }
  };

  return (
    <Box
      ref={dragHandle}
      style={style}
      sx={{
        display: "flex",
        alignItems: "center",
        fontSize: 16,
        // ":hover": {
        //   backgroundColor:
        //
        // },
      }}
      onClick={handleClick}
    >
      <FolderArrow node={node} />
      {dataType === NodeDataChildType.Collection && (
        <LibraryBooksIcon fontSize="inherit" />
      )}
      {dataType === NodeDataChildType.Category && (
        <MenuBookIcon fontSize="inherit" />
      )}
      {dataType === NodeDataChildType.Text && (
        <ShortTextIcon fontSize="inherit" />
      )}
      <Tooltip
        title={<Typography>{name}</Typography>}
        PopperProps={{ disablePortal: true }}
        disableHoverListener={name.length < 35}
      >
        {dataType === NodeDataChildType.Text ? (
          <Link href={getTableViewUrl({ sourceLanguage, fileName })}>
            {name}
          </Link>
        ) : (
          <Typography
            textOverflow="ellipsis"
            fontSize="inherit"
            whiteSpace="nowrap"
            sx={{ px: 1 }}
          >
            {name}
          </Typography>
        )}
      </Tooltip>
    </Box>
  );
}

// https://github.com/brimdata/react-arborist
const TreeViewContent = memo(function TreeViewContent({
  data,
  height,
  searchTerm,
}: {
  data: SourceTextBrowserData;
  height: number;
  searchTerm?: string;
}) {
  // expensive operation - memoise the result for better performance on subsequent renders
  const treeData = useMemo(() => transformDataForTreeView(data), [data]);

  return (
    <Tree
      searchTerm={searchTerm}
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
  parentHeight,
}: {
  parentHeight: number;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { sourceLanguage } = useDbQueryParams();
  const { observe, height: inputHeight } = useDimensions();

  // TODO: add error handling
  const { data, isLoading } = useQuery<SourceTextBrowserData>({
    queryKey: DbApi.SidebarSourceTexts.makeQueryKey(sourceLanguage),
    queryFn: () => DbApi.SidebarSourceTexts.call(sourceLanguage),
  });

  return isLoading || !data ? (
    <CircularProgress />
  ) : (
    <Box sx={{ py: 2, px: 1 }}>
      <>
        <Input
          ref={observe}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <TreeViewContent
          data={data}
          height={parentHeight - inputHeight}
          searchTerm={searchTerm}
        />
      </>
    </Box>
  );
});
