import React, { useCallback } from "react";
import { textViewRightPaneFileNameAtom } from "@atoms";
import { useRightPaneActiveSegmentParam } from "@components/hooks/params";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { CloseTextViewPaneButton } from "@features/textView/CloseTextViewPaneButton";
import { TextViewPane } from "@features/textView/TextViewPane";
import { CardHeader } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";

export const TextViewRightPane = () => {
  const { fileName } = useDbRouterParams();
  const [activeSegmentId, setActiveSegment] = useRightPaneActiveSegmentParam();
  const setRightPaneFileName = useSetAtom(textViewRightPaneFileNameAtom);

  const handleClear = useCallback(async () => {
    await setActiveSegment("none");
    setRightPaneFileName(undefined);
  }, [setActiveSegment, setRightPaneFileName]);

  const rightPaneFileName = useAtomValue(textViewRightPaneFileNameAtom);

  return (
    <>
      <CardHeader
        data-testid="middle-view-header"
        sx={{
          backgroundColor: "background.card",
          position: "sticky",
          top: 0,
          zIndex: 2,
          width: "100%",
        }}
        action={<CloseTextViewPaneButton handlePress={handleClear} />}
        title={rightPaneFileName}
        subheader={activeSegmentId}
      />

      <TextViewPane
        activeSegmentId={activeSegmentId}
        fileName={fileName}
        isRightPane={true}
      />
    </>
  );
};
