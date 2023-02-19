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
    return node.isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />;
  }
  return null;
}

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
        <Box>
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
        </Box>
      </Tooltip>
    </Box>
  );
}
