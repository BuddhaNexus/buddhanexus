import React, { useCallback } from "react";
import { useRightPaneActiveSegmentParam } from "@components/hooks/params";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { CloseTextViewPaneButton } from "@features/textView/CloseTextViewPaneButton";
import { TextViewPane } from "@features/textView/TextViewPane";
import { CardHeader } from "@mui/material";

export const TextViewRightPane = () => {
  const { fileName } = useDbRouterParams();
  const [activeSegmentId, setActiveSegment] = useRightPaneActiveSegmentParam();

  const handleClear = useCallback(async () => {
    await setActiveSegment("none");
  }, [setActiveSegment]);

  const rightPaneFileName = "sd";

  return (
    <>
      <CardHeader
        data-testid="middle-view-header"
        sx={{
          backgroundColor: "background.paper",
          position: "sticky",
          top: 0,
          zIndex: 2,
          width: "100%",
        }}
        action={<CloseTextViewPaneButton handlePress={handleClear} />}
        title={rightPaneFileName}
      />

      <TextViewPane
        activeSegmentId={activeSegmentId}
        fileName={fileName}
        isRightPane={true}
      />
    </>
  );
};
