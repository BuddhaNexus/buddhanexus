import React, { useCallback } from "react";
import { useRightPaneActiveSegmentParam } from "@components/hooks/params";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { CloseTextViewPaneButton } from "@features/textView/CloseTextViewPaneButton";
import { TextViewPane } from "@features/textView/TextViewPane";
import { Box } from "@mui/material";

export const TextViewRightPane = () => {
  const { fileName } = useDbRouterParams();
  const [activeSegmentId, setActiveSegment] = useRightPaneActiveSegmentParam();

  const handleClear = useCallback(async () => {
    await setActiveSegment("none");
  }, [setActiveSegment]);

  return (
    <>
      <Box sx={{ position: "absolute", p: 1.5, right: 0, zIndex: 10 }}>
        <CloseTextViewPaneButton handlePress={handleClear} />{" "}
      </Box>

      <TextViewPane
        activeSegmentId={activeSegmentId}
        fileName={fileName}
        isRightPane={true}
      />
    </>
  );
};
