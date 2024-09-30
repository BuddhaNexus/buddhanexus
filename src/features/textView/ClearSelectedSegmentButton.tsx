import React from "react";
import { useTranslation } from "next-i18next";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IconButton, Tooltip } from "@mui/material";
import { useQueryParam } from "use-query-params";

export function ClearSelectedSegmentButton() {
  const [, setSelectedSegmentId] = useQueryParam("selectedSegment");

  const { t } = useTranslation();

  return (
    <Tooltip
      title={t("common:db.clearSelectedSegment")}
      PopperProps={{ disablePortal: true }}
    >
      <IconButton
        color="inherit"
        onClick={() => setSelectedSegmentId(undefined)}
      >
        <HighlightOffIcon aria-label={t("common:db.clearSelectedSegment")} />
      </IconButton>
    </Tooltip>
  );
}
