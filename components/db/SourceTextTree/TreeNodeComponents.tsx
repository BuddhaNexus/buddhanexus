import type { NodeApi, NodeRendererProps } from "react-arborist";
import { Link } from "@components/common/Link";
import { getTextPath } from "@components/common/utils";
import type { SourceTextTreeNode } from "@components/db/SourceTextTree/types";
import { SourceTextTreeNodeDataType } from "@components/db/SourceTextTree/types";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ShortTextIcon from "@mui/icons-material/ShortText";
import { Box, Checkbox, Chip, Tooltip, Typography } from "@mui/material";
import { currentViewAtom } from "features/atoms";
import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";

import styles from "./TreeNodeComponents.module.css";

const CHARACTER_WIDTH = 8;
const INDENTATION_WIDTH = 90;

function FolderArrow({ node }: { node: NodeApi<SourceTextTreeNode> }) {
  if (node.isInternal) {
    return node.isOpen ? (
      <ExpandMoreIcon sx={{ mr: 1 }} />
    ) : (
      <ChevronRightIcon sx={{ mr: 1 }} />
    );
  }
  return null;
}

function TextItemLink({ node }: { node: NodeApi<SourceTextTreeNode> }) {
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

function ParentItemExpander({ node }: { node: NodeApi<SourceTextTreeNode> }) {
  const { dataType, name, id } = node.data;

  return (
    <>
      {dataType === SourceTextTreeNodeDataType.Collection && (
        <LibraryBooksIcon fontSize="inherit" />
      )}
      {dataType === SourceTextTreeNodeDataType.Category && (
        <Chip
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <MenuBookIcon fontSize="inherit" /> {id}
            </Box>
          }
          size="small"
          variant="outlined"
        />
      )}
      <Typography fontSize="inherit" whiteSpace="nowrap" mx={1}>
        {name}
      </Typography>
    </>
  );
}

export function BrowserNode({
  node,
  style,
  // TODO: check if this `dragHandle` can be removed
  dragHandle,
}: NodeRendererProps<SourceTextTreeNode>) {
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

      {dataType === SourceTextTreeNodeDataType.Text ? (
        <TextItemLink node={node} />
      ) : (
        <ParentItemExpander node={node} />
      )}
    </Box>
  );
}

type SelectorNodeProps = {
  selectedItemsAtom: PrimitiveAtom<SourceTextTreeNode[]>;
} & NodeRendererProps<SourceTextTreeNode>;

export function SelectorNode({
  node,
  style,
  selectedItemsAtom,
}: SelectorNodeProps) {
  const { name, id } = node.data;

  const [selectedSourceFilter, setSelectedSourceFilter] =
    useAtom(selectedItemsAtom);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (node.isLeaf) return;

    const isCheckboxClick =
      event.nativeEvent.target instanceof HTMLInputElement;

    if (isCheckboxClick) return;

    node.toggle();
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedSourceFilter([...selectedSourceFilter, node.data]);
    } else {
      setSelectedSourceFilter(
        selectedSourceFilter.filter((excludeItem) => excludeItem.id !== id),
      );
    }
  };

  return (
    <Box
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

      <Checkbox
        size="small"
        checked={selectedSourceFilter.some((item) => item.id === id)}
        onChange={handleCheckboxChange}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Tooltip
          title={<Typography>{name}</Typography>}
          PopperProps={{ disablePortal: true }}
          // disableHoverListener={nameWidth < elementWidth}
          enterDelay={300}
        >
          <Typography
            className={styles.textName}
            overflow="clip"
            textOverflow="ellipsis"
            variant="body3"
            whiteSpace="nowrap"
            lineHeight={1.1}
            sx={{ px: 0.5, display: "flex", flexDirection: "column" }}
          >
            <Typography variant="body2" component="span">
              {id}:
            </Typography>{" "}
            {name}
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  );
}
