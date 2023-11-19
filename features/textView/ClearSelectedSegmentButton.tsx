import React from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IconButton, Tooltip } from "@mui/material";
import { useQueryParam } from "use-query-params";

export function ClearSelectedSegmentButton() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setSelectedSegmentId] = useQueryParam<string>("selectedSegment");

  return (
    <Tooltip
      title="Clear selected segment"
      PopperProps={{ disablePortal: true }}
    >
      <IconButton color="inherit" onClick={() => setSelectedSegmentId("")}>
        {/* todo: add i18n */}
        <HighlightOffIcon aria-label="clear selected segment" />
      </IconButton>
    </Tooltip>
  );
}
