import React from "react";
import { useTranslation } from "next-i18next";
import { activeDbSourceTreeAtom } from "@atoms";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useAtomValue } from "jotai";
import { DbSourceTreeType } from "src/components/db/SearchableDbSourceTree/types";

import TreeBreadcrumbs from "./TreeBreadcrumbs";

type TreeNavigationProps = {
  type: DbSourceTreeType;
};

export default function TreeNavigation({ type }: TreeNavigationProps) {
  const activeTree = useAtomValue(activeDbSourceTreeAtom);

  const { t } = useTranslation(["common"]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      gap="0.5rem"
      minHeight="1.75rem"
      mt={type === DbSourceTreeType.BROWSER ? 2 : 1}
      mb={1}
    >
      <TreeBreadcrumbs type={type} />

      <Box display="flex" justifySelf="flex-end">
        <Tooltip title={t("prompts.openAll")}>
          <IconButton
            aria-label={t("prompts.openAll")}
            size="small"
            onClick={() => activeTree?.openAll()}
          >
            <ArrowDropDownIcon color="action" />
          </IconButton>
        </Tooltip>

        <Tooltip title={t("prompts.closeAll")}>
          <IconButton
            aria-label={t("prompts.closeAll")}
            size="small"
            onClick={() => activeTree?.closeAll()}
          >
            <ArrowDropDownIcon
              color="action"
              sx={{
                transform: "rotate(180deg)",
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
