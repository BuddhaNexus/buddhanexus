import React from "react";
import { NodeApi } from "react-arborist";
import { DbSourceTreeNodeDataType as NodeType } from "@components/db/SearchableDbSourceTree/types";
import { Chip, Typography } from "@mui/material";

import { SourceTypeIcon } from "./SourceTypeIcon";
import { RowBox } from "./styledComponents";

export function ParentItemExpander({ node }: { node: NodeApi<any> }) {
  const { dataType, name, id } = node.data;

  return (
    <>
      {dataType === NodeType.Collection && (
        <SourceTypeIcon dataType={dataType} fontSize="inherit" />
      )}
      {dataType === NodeType.Category && (
        <Chip
          label={
            <RowBox sx={{ gap: "0.5rem" }}>
              <SourceTypeIcon dataType={dataType} fontSize="inherit" /> {id}
            </RowBox>
          }
          size="small"
          variant="outlined"
        />
      )}
      <Typography fontSize="inherit" whiteSpace="nowrap" marginInline="0.5rem">
        {name}
      </Typography>
    </>
  );
}
