import type { NodeApi, NodeRendererProps } from "react-arborist";
import { Link } from "@components/common/Link";
import { getTextPath } from "@components/common/utils";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import type { DrawerNavigationNodeData } from "@components/treeView/types";
import { NodeDataChildType } from "@components/treeView/types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ShortTextIcon from "@mui/icons-material/ShortText";
import { Box, Chip, Tooltip, Typography } from "@mui/material";
import { currentViewAtom } from "features/atoms";
import { useAtomValue } from "jotai";

import styles from "./TreeNodeComponents.module.css";

const CHARACTER_WIDTH = 8;
const INDENTATION_WIDTH = 90;

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

function TextItemLink({ node }: { node: NodeApi<DrawerNavigationNodeData> }) {
  const { name, fileName, id } = node.data;
  let elementWidth = 300;
  const nameWidth = name.length * CHARACTER_WIDTH;

  if (typeof node.tree.props.width === "number") {
    elementWidth = node.tree.props.width - INDENTATION_WIDTH;
  }

  const { sourceLanguage } = useDbQueryParams();
  const dbView = useAtomValue(currentViewAtom);
  return (
    <Link
      className={styles.textNodeLink}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        pt: 0.75,
        fontSize: "inherit",
        textDecoration: "none",
      }}
      href={getTextPath({ sourceLanguage, fileName, dbView })}
    >
      <div>
        <Chip
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <ShortTextIcon fontSize="inherit" />
              {id}
            </Box>
          }
          size="small"
          variant="outlined"
          sx={{
            width: "fit-content",
            mx: 1,
          }}
        />

        <Tooltip
          title={<Typography>{name}</Typography>}
          PopperProps={{ disablePortal: true }}
          disableHoverListener={nameWidth < elementWidth}
          enterDelay={300}
        >
          <Typography
            className={styles.textName}
            overflow="clip"
            textOverflow="ellipsis"
            fontSize="inherit"
            whiteSpace="nowrap"
            sx={{ px: 1 }}
          >
            {name}
          </Typography>
        </Tooltip>
      </div>
    </Link>
  );
}

function ParentItemExpander({
  node,
}: {
  node: NodeApi<DrawerNavigationNodeData>;
}) {
  const { dataType, name, id } = node.data;

  return (
    <>
      {dataType === NodeDataChildType.Collection && (
        <LibraryBooksIcon fontSize="inherit" />
      )}
      {dataType === NodeDataChildType.Category && (
        <Chip
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <MenuBookIcon fontSize="inherit" /> {id}
            </Box>
          }
          size="small"
          variant="outlined"
          sx={{ width: "fit-content", mx: 1 }}
        />
      )}
      <Typography fontSize="inherit" whiteSpace="nowrap">
        {name}
      </Typography>
    </>
  );
}

export function Node({
  node,
  style,
  // TODO: check if this `dragHandle` can be removed
  dragHandle,
}: NodeRendererProps<DrawerNavigationNodeData>) {
  const { dataType } = node.data;

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
        flex: 1,
        height: "100%",
        display: "flex",
        alignItems: "center",
        fontSize: 16,
        ":hover": {
          backgroundColor: "grey.200",
          fontWeight: 500,
        },
      }}
      onClick={handleClick}
    >
      <FolderArrow node={node} />

      {dataType === NodeDataChildType.Text ? (
        <TextItemLink node={node} />
      ) : (
        <ParentItemExpander node={node} />
      )}
    </Box>
  );
}
