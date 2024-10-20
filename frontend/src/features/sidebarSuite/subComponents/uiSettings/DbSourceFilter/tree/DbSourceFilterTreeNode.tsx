import React from "react";
import type { NodeApi, NodeRendererProps } from "react-arborist";
import { ExpanderArrow } from "@components/db/SearchableDbSourceTree/nodeComponents/ExpanderArrow";
import { SourceTypeIcon } from "@components/db/SearchableDbSourceTree/nodeComponents/SourceTypeIcon";
import {
  NodeBox,
  NodeLabelsBox,
  RowBox,
  TextNameTypography,
} from "@components/db/SearchableDbSourceTree/nodeComponents/styledComponents";
import styles from "@components/db/SearchableDbSourceTree/nodeComponents/TextItemLink.module.css";
import {
  type DbSourceTreeNode,
  DbSourceTreeNodeDataType as NodeType,
} from "@components/db/SearchableDbSourceTree/types";
import {
  useExcludeCategoriesParam,
  useExcludeCollectionsParam,
  useExcludeFilesParam,
  useIncludeCategoriesParam,
  useIncludeCollectionsParam,
  useIncludeFilesParam,
} from "@components/hooks/params";
import {
  DB_SOURCE_UPDATE_MAPPING,
  updateFilterParamArray,
} from "@features/sidebarSuite/subComponents/uiSettings/DbSourceFilter/utils";
import { DbSourceFilterUISetting } from "@features/sidebarSuite/types";
import { Box, Checkbox, Tooltip, Typography } from "@mui/material";

const CHARACTER_WIDTH = 6.5;
const INDENTATION_WIDTH = 90;
const DEFAULT_NODE_WIDTH = 300;

type HandleFilterNodeClickProps = {
  node: NodeApi<DbSourceTreeNode>;
  event: React.MouseEvent<HTMLElement>;
};

const handleClick = ({ node, event }: HandleFilterNodeClickProps) => {
  if (node.isLeaf) return;

  const isCheckboxClick = event.nativeEvent.target instanceof HTMLInputElement;

  if (isCheckboxClick) return;

  node.toggle();
};

type DbSourceFilterTreeNodeProps = {
  filterSettingName: DbSourceFilterUISetting;
  selectionIds: string[];
} & NodeRendererProps<DbSourceTreeNode>;

export function DbSourceFilterTreeNode({
  node,
  style,
  filterSettingName,
  selectionIds,
}: DbSourceFilterTreeNodeProps) {
  const { name, id, dataType } = node.data;

  const [, setExcludeCollections] = useExcludeCollectionsParam();
  const [, setExcludeCategories] = useExcludeCategoriesParam();
  const [, setExcludeFiles] = useExcludeFilesParam();
  const [, setIncludeCollections] = useIncludeCollectionsParam();
  const [, setIncludeCategories] = useIncludeCategoriesParam();
  const [, setIncludeFiles] = useIncludeFilesParam();

  let elementWidth = DEFAULT_NODE_WIDTH;
  const nameWidth = name.length * CHARACTER_WIDTH;

  if (typeof node.tree.props.width === "number") {
    elementWidth = node.tree.props.width - INDENTATION_WIDTH;
  }

  const handleFilterParamUpdate = React.useCallback(
    async ({
      action,
      item,
      filterName,
    }: {
      action: "add" | "remove";
      item: DbSourceTreeNode;
      filterName: DbSourceFilterUISetting;
    }) => {
      const { id: itemId, dataType: type } = item;
      const targetFilter = DB_SOURCE_UPDATE_MAPPING[type][filterName];

      if (targetFilter === "exclude_collections") {
        await setExcludeCollections((prev) =>
          updateFilterParamArray({ array: prev ?? [], id: itemId, action }),
        );
        return;
      }

      if (targetFilter === "exclude_categories") {
        await setExcludeCategories((prev) =>
          updateFilterParamArray({ array: prev ?? [], id: itemId, action }),
        );
        return;
      }

      if (targetFilter === "exclude_files") {
        await setExcludeFiles((prev) =>
          updateFilterParamArray({ array: prev ?? [], id: itemId, action }),
        );
        return;
      }

      if (targetFilter === "include_collections") {
        await setIncludeCollections((prev) =>
          updateFilterParamArray({ array: prev ?? [], id: itemId, action }),
        );
        return;
      }

      if (targetFilter === "include_categories") {
        await setIncludeCategories((prev) =>
          updateFilterParamArray({ array: prev ?? [], id: itemId, action }),
        );
        return;
      }

      if (targetFilter === "include_files") {
        await setIncludeFiles((prev) =>
          updateFilterParamArray({ array: prev ?? [], id: itemId, action }),
        );
      }
    },
    [
      setExcludeCollections,
      setExcludeCategories,
      setExcludeFiles,
      setIncludeCollections,
      setIncludeCategories,
      setIncludeFiles,
    ],
  );

  return (
    <NodeBox
      key={`${id}-${filterSettingName}`}
      style={style}
      sx={{
        ml: dataType === NodeType.Text ? 1.1 : undefined,
      }}
      role="option"
      isSelected={node.isSelected}
      onClick={(event) => handleClick({ node, event })}
    >
      <ExpanderArrow node={node} mr={0} />

      <Checkbox
        size="small"
        checked={selectionIds.some((item) => item === id)}
        onChange={async (event) => {
          await handleFilterParamUpdate({
            action: event.target.checked ? "add" : "remove",
            item: node.data,
            filterName: filterSettingName,
          });
        }}
      />

      <NodeLabelsBox>
        <Tooltip
          title={<Typography>{name}</Typography>}
          PopperProps={{ disablePortal: true }}
          disableHoverListener={nameWidth < elementWidth}
          enterDelay={300}
        >
          <Box className={styles.textName} sx={{ px: 0.5, lineHeight: 1.1 }}>
            <RowBox>
              <SourceTypeIcon
                dataType={dataType}
                sx={{
                  my: 0.5,
                  mr: 0.5,
                  fontSize: "0.85rem",
                  color: "grey.500",
                }}
              />
              <Typography variant="body2" component="span">
                {id}
              </Typography>
            </RowBox>

            <TextNameTypography variant="body3" sx={{ maxWidth: elementWidth }}>
              {name}
            </TextNameTypography>
          </Box>
        </Tooltip>
      </NodeLabelsBox>
    </NodeBox>
  );
}
