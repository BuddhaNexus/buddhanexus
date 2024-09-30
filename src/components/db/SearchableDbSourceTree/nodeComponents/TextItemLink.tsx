import React from "react";
import { NodeApi } from "react-arborist";
import { getTextPath } from "@components/common/utils";
import { DbSourceTreeNode } from "@components/db/SearchableDbSourceTree/types";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@features/atoms";
import { Chip, Tooltip, Typography } from "@mui/material";
import { useAtomValue } from "jotai";

import { SourceTypeIcon } from "./SourceTypeIcon";
import { RowBox, TextNameTypography, TextNodeLink } from "./styledComponents";
import styles from "./TextItemLink.module.css";

const CHARACTER_WIDTH = 8;
const INDENTATION_WIDTH = 90;
const DEFAULT_NODE_WIDTH = 300;

export function TextItemLink({ node }: { node: NodeApi<DbSourceTreeNode> }) {
  const { name, fileName, id, dataType } = node.data;
  let elementWidth = DEFAULT_NODE_WIDTH;
  const nameWidth = name.length * CHARACTER_WIDTH;

  if (typeof node.tree.props.width === "number") {
    elementWidth = node.tree.props.width - INDENTATION_WIDTH;
  }

  const { sourceLanguage } = useDbQueryParams();
  const dbView = useAtomValue(currentViewAtom);
  return (
    <TextNodeLink
      className={styles.textNodeLink}
      href={getTextPath({ sourceLanguage, fileName, dbView })}
    >
      <div>
        <Chip
          label={
            <RowBox sx={{ gap: "0.25rem" }}>
              <SourceTypeIcon dataType={dataType} />
              {id}
            </RowBox>
          }
          size="small"
          variant="outlined"
        />

        <Tooltip
          title={<Typography>{name}</Typography>}
          PopperProps={{ disablePortal: true }}
          disableHoverListener={nameWidth < elementWidth}
          enterDelay={300}
        >
          <TextNameTypography className={styles.textName}>
            {name}
          </TextNameTypography>
        </Tooltip>
      </div>
    </TextNodeLink>
  );
}
