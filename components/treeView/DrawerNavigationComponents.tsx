import type { NodeApi, NodeRendererProps } from "react-arborist";
import { Link } from "@components/common/Link";
import { getTableViewUrl } from "@components/common/utils";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import type { DrawerNavigationNodeData } from "@components/treeView/types";
import { NodeDataChildType } from "@components/treeView/types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ShortTextIcon from "@mui/icons-material/ShortText";
import { Box, Tooltip, Typography } from "@mui/material";

function FolderArrow({ node }: { node: NodeApi<DrawerNavigationNodeData> }) {
  if (node.isInternal) {
    return node.isOpen ? (
      <ExpandMoreIcon sx={{ mr: 1 }} />
    ) : (
      <ChevronRightIcon sx={{ mr: 1 }} />
    );
  }
  return null;
}

const MIN_CHAR_LENGTH_TO_SHOW_TOOLTIP = 42;

export function Node({
  node,
  style,
  dragHandle,
}: NodeRendererProps<DrawerNavigationNodeData>) {
  const { dataType, name, fileName } = node.data;
  const { sourceLanguage } = useDbQueryParams();

  const handleClick = () => {
    if (node.isInternal) {
      node.toggle();
    }
  };

  return (
    <Box
      ref={dragHandle}
      style={style}
      sx={{
        display: "flex",
        alignItems: "center",
        fontSize: 16,
        ":hover": {
          backgroundColor: node.isLeaf ? "inherit" : "background.header",
          fontWeight: 500,
        },
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
        disableHoverListener={name.length < MIN_CHAR_LENGTH_TO_SHOW_TOOLTIP}
      >
        <Box>
          {dataType === NodeDataChildType.Text ? (
            <Link
              sx={{
                px: 1,
                textOverflow: "ellipsis",
                fontSize: "inherit",
                whiteSpace: "nowrap",
              }}
              href={getTableViewUrl({ sourceLanguage, fileName })}
            >
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
        </Box>
      </Tooltip>
    </Box>
  );
}
