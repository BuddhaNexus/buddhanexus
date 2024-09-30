import React from "react";
import type { NodeRendererProps } from "react-arborist";
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
import { Box, Checkbox, Tooltip, Typography } from "@mui/material";
import {
  DbSourceFilters,
  DbSourceFilterType,
} from "features/sidebarSuite/config/types";
import {
  DB_SOURCE_UPDATE_MAPPING,
  updateFilterParamArray,
} from "features/sidebarSuite/subComponents/settings/DbSourceFilters/utils";
import { parseAsJson, useQueryState } from "nuqs";

const CHARACTER_WIDTH = 6.5;
const INDENTATION_WIDTH = 90;
const DEFAULT_NODE_WIDTH = 300;

type DbSourceFilterTreeNodeProps = {
  filterSettingName: DbSourceFilterType;
  selectionIds: string[];
} & NodeRendererProps<DbSourceTreeNode>;

export function DbSourceFilterTreeNode({
  node,
  style,
  filterSettingName,
  selectionIds,
}: DbSourceFilterTreeNodeProps) {
  const { name, id, dataType } = node.data;

  const [, setFilterParam] = useQueryState(
    "filters",
    parseAsJson<DbSourceFilters>(),
  );

  let elementWidth = DEFAULT_NODE_WIDTH;
  const nameWidth = name.length * CHARACTER_WIDTH;

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

  const handleFilterParamUpdate = React.useCallback(
    async ({
      action,
      item,
      filterName,
    }: {
      action: "add" | "remove";
      item: DbSourceTreeNode;
      filterName: DbSourceFilterType;
    }) => {
      const { id: itemId, dataType: type } = item;

      await setFilterParam((currentFilterParam) => {
        const updatedFilterParam = { ...currentFilterParam };

        const updateKey = DB_SOURCE_UPDATE_MAPPING[type][filterName];

        updatedFilterParam[updateKey] = updateFilterParamArray({
          array: currentFilterParam?.[updateKey] ?? [],
          id: itemId,
          action,
        });

        return updatedFilterParam;
      });
    },
    [setFilterParam],
  );

  return (
    <NodeBox
      key={`${id}-${filterSettingName}`}
      style={style}
      sx={{
        ml: dataType === NodeType.Text ? 1.1 : undefined,
      }}
      role="option"
      onClick={handleClick}
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
          <Box
            className={styles.textName}
            sx={{
              px: 0.5,
              display: "flex",
              flexDirection: "column",
            }}
          >
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
              <Typography
                variant="body2"
                component="span"
                sx={{ display: "block", mt: 0.25 }}
              >
                {id}
              </Typography>
            </RowBox>

            <TextNameTypography
              variant="body3"
              lineHeight={1.1}
              sx={{ maxWidth: elementWidth }}
            >
              {name}
            </TextNameTypography>
          </Box>
        </Tooltip>
      </NodeLabelsBox>
    </NodeBox>
  );
}
