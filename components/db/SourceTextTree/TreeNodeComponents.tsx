import React from "react";
import type { NodeApi, NodeRendererProps } from "react-arborist";
import { Link } from "@components/common/Link";
import { getTextPath } from "@components/common/utils";
import type { SourceTextTreeNode } from "@components/db/SourceTextTree/types";
import { SourceTextTreeNodeDataType } from "@components/db/SourceTextTree/types";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ShortTextIcon from "@mui/icons-material/ShortText";
import {
  Box,
  Checkbox,
  Chip,
  SvgIconProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { currentViewAtom } from "features/atoms";
import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";

import styles from "./TreeNodeComponents.module.css";

const CHARACTER_WIDTH = 8;
const CHARACTER_WIDTH_SMALL = 6.5;
const INDENTATION_WIDTH = 90;
const DEFAULT_NODE_WIDTH = 300;

const nodeBoxStyles = {
  flex: 1,
  height: "100%",
  display: "flex",
  alignItems: "center",
  fontSize: 16,
  ":hover": {
    backgroundColor: "grey.200",
    fontWeight: 500,
  },
};

const labelBaseStyles = {
  overflow: "clip",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "inherit",
};

function ExpanderArrow({
  node,
  mr = 1,
}: {
  node: NodeApi<SourceTextTreeNode>;
  mr?: number;
}) {
  if (!node.isInternal) return null;

  return (
    <ChevronRightIcon
      sx={{
        mr,
        transform: node.isOpen ? "rotate(90deg)" : undefined,
        transition: "transform 200ms",
      }}
    />
  );
}

function SourceTypeIcon({
  dataType,
  ...iconProps
}: SvgIconProps & {
  dataType: SourceTextTreeNodeDataType;
}) {
  if (dataType === SourceTextTreeNodeDataType.Collection) {
    return <LibraryBooksIcon {...iconProps} />;
  }

  if (dataType === SourceTextTreeNodeDataType.Category) {
    return <MenuBookIcon {...iconProps} />;
  }

  return <ShortTextIcon {...iconProps} />;
}

function TextItemLink({ node }: { node: NodeApi<SourceTextTreeNode> }) {
  const { name, fileName, id, dataType } = node.data;
  let elementWidth = DEFAULT_NODE_WIDTH;
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
              <SourceTypeIcon dataType={dataType} />
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
            sx={{ ...labelBaseStyles, px: 1 }}
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
        <SourceTypeIcon dataType={dataType} fontSize="inherit" />
      )}
      {dataType === SourceTextTreeNodeDataType.Category && (
        <Chip
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <SourceTypeIcon dataType={dataType} fontSize="inherit" /> {id}
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
      sx={nodeBoxStyles}
      onClick={handleClick}
    >
      <ExpanderArrow node={node} />

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
  const { name, id, dataType } = node.data;

  const [selectedSourceFilter, setSelectedSourceFilter] =
    useAtom(selectedItemsAtom);

  let elementWidth = DEFAULT_NODE_WIDTH;
  const nameWidth = name.length * CHARACTER_WIDTH_SMALL;

  if (typeof node.tree.props.width === "number") {
    elementWidth = node.tree.props.width - INDENTATION_WIDTH;
  }

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (node.isLeaf) return;

      const isCheckboxClick =
        event.nativeEvent.target instanceof HTMLInputElement;

      if (isCheckboxClick) return;

      node.toggle();
    },
    [node],
  );

  const handleCheckboxChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setSelectedSourceFilter([...selectedSourceFilter, node.data]);
      } else {
        setSelectedSourceFilter(
          selectedSourceFilter.filter((excludeItem) => excludeItem.id !== id),
        );
      }
    },
    [node, selectedSourceFilter],
  );

  return (
    <Box
      style={style}
      sx={{
        ...nodeBoxStyles,
        ml: dataType === SourceTextTreeNodeDataType.Text ? 1.1 : undefined,
      }}
      onClick={handleClick}
    >
      <ExpanderArrow node={node} mr={0} />

      <Checkbox
        size="small"
        checked={selectedSourceFilter.some((item) => item.id === id)}
        onChange={handleCheckboxChange}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          width: "100%",
        }}
      >
        <Tooltip
          title={<Typography>{name}</Typography>}
          PopperProps={{ disablePortal: true }}
          disableHoverListener={nameWidth < elementWidth}
          enterDelay={300}
        >
          <Box
            className={styles.textName}
            sx={{
              px: 0.5,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SourceTypeIcon
                dataType={dataType}
                sx={{ mr: 0.5, fontSize: "0.85rem", color: "grey.500" }}
              />
              <Typography
                variant="body2"
                component="span"
                sx={{ display: "block", mt: 0.25 }}
              >
                {id}
              </Typography>
            </Box>
            <Typography
              variant="body3"
              lineHeight={1.1}
              sx={{
                maxWidth: elementWidth,
                ...labelBaseStyles,
              }}
            >
              {name}
            </Typography>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}
