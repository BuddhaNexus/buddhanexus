import React from "react";
import { NodeApi } from "react-arborist";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom, isDbSourceBrowserDrawerOpenAtom } from "@atoms";
import { Link } from "@components/common/Link";
import { getTextPath } from "@components/common/utils";
import { DbSourceTreeNode } from "@components/db/SearchableDbSourceTree/types";
import { isDbSourceTreeLeafNodeData } from "@components/db/SearchableDbSourceTree/utils";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { Chip, Tooltip, Typography } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";

import { SourceTypeIcon } from "./SourceTypeIcon";
import { RowBox, TextNameTypography } from "./styledComponents";
import styles from "./TextItemLink.module.css";

const CHARACTER_WIDTH = 8;
const INDENTATION_WIDTH = 90;
const DEFAULT_NODE_WIDTH = 300;

export function TextItemLinkBody({
  data,
  children,
  treeWidth,
}: {
  data: DbSourceTreeNode;
  children: React.ReactNode;
  treeWidth: string | number | undefined;
}) {
  const { name, id, dataType } = data;
  let elementWidth = DEFAULT_NODE_WIDTH;
  const nameWidth = name.length * CHARACTER_WIDTH;

  if (typeof treeWidth === "number") {
    elementWidth = treeWidth - INDENTATION_WIDTH;
  }

  return (
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
        <span>{children}</span>
      </Tooltip>
    </div>
  );
}

export function TextItemLink({ node }: { node: NodeApi<DbSourceTreeNode> }) {
  const { dbLanguage } = useDbRouterParams();
  const dbView = useAtomValue(currentDbViewAtom);

  const { t } = useTranslation();

  const [, setIsDrawerOpen] = useAtom(isDbSourceBrowserDrawerOpenAtom);

  const { data } = node;

  if (!isDbSourceTreeLeafNodeData(data)) {
    return (
      <TextItemLinkBody data={data} treeWidth={node.tree.props.width}>
        <Typography className={styles.textName} color="error.main">
          {data.name} | {t("prompts.fileUndefined")}
        </Typography>
      </TextItemLinkBody>
    );
  }

  return (
    <Link
      className={styles.textNodeLink}
      href={getTextPath({ dbLanguage, fileName: data.fileName, dbView })}
      onClick={() => setIsDrawerOpen(false)}
    >
      <TextItemLinkBody data={data} treeWidth={node.tree.props.width}>
        <TextNameTypography className={styles.textName}>
          {data.name}
        </TextNameTypography>
      </TextItemLinkBody>
    </Link>
  );
}
