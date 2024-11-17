import React from "react";
import { useTranslation } from "next-i18next";
import {
  useActiveSegmentIndexParam,
  useActiveSegmentParam,
} from "@components/hooks/params";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IconButton, Tooltip } from "@mui/material";

export function ClearSelectedSegmentButton() {
  const { t } = useTranslation();

  const [, setActiveSegment] = useActiveSegmentParam();
  const [, setActiveSegmentIndex] = useActiveSegmentIndexParam();

  const handleClear = async () => {
    await setActiveSegment("none");
    await setActiveSegmentIndex(null);
  };

  return (
    <Tooltip
      title={t("common:db.clearSelectedSegment")}
      PopperProps={{ disablePortal: true }}
    >
      <IconButton color="inherit" onClick={handleClear}>
        <HighlightOffIcon aria-label={t("common:db.clearSelectedSegment")} />
      </IconButton>
    </Tooltip>
  );
}
