import React from "react";
import { useTranslation } from "next-i18next";
import { useActiveSegmentParam } from "@components/hooks/params";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IconButton, Tooltip } from "@mui/material";

export function ClearSelectedSegmentButton() {
  const [, setActiveSegment] = useActiveSegmentParam();

  const { t } = useTranslation();

  return (
    <Tooltip
      title={t("common:db.clearSelectedSegment")}
      PopperProps={{ disablePortal: true }}
    >
      <IconButton color="inherit" onClick={() => setActiveSegment(null)}>
        <HighlightOffIcon aria-label={t("common:db.clearSelectedSegment")} />
      </IconButton>
    </Tooltip>
  );
}
