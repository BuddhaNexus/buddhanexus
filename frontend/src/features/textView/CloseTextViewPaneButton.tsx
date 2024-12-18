import React from "react";
import { useTranslation } from "next-i18next";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IconButton, Tooltip } from "@mui/material";

interface Props {
  handlePress: () => void;
}

export function CloseTextViewPaneButton({ handlePress }: Props) {
  const { t } = useTranslation();

  return (
    <Tooltip
      title={t("common:db.clearSelectedSegment")}
      PopperProps={{ disablePortal: true }}
    >
      <IconButton color="inherit" onClick={handlePress}>
        <HighlightOffIcon aria-label={t("common:db.clearSelectedSegment")} />
      </IconButton>
    </Tooltip>
  );
}
