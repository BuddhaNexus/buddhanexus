import React, { useCallback } from "react";
import { textViewRightPaneFileNameAtom } from "@atoms";
import {
  useRightPaneActiveSegmentIndexParam,
  useRightPaneActiveSegmentParam,
} from "@components/hooks/params";
import { CloseTextViewPaneButton } from "@features/textView/CloseTextViewPaneButton";
import { TextViewPane } from "@features/textView/TextViewPane";
import { Box, CardHeader } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";

export const TextViewRightPane = () => {
  const [activeSegmentId, setActiveSegmentId] =
    useRightPaneActiveSegmentParam();
  const [activeSegmentIndex, setActiveSegmentIndex] =
    useRightPaneActiveSegmentIndexParam();
  const setRightPaneFileName = useSetAtom(textViewRightPaneFileNameAtom);

  const handleClear = useCallback(async () => {
    await setActiveSegmentId("none");
    await setActiveSegmentIndex(null);
    setRightPaneFileName(undefined);
  }, [setActiveSegmentId, setActiveSegmentIndex, setRightPaneFileName]);

  const rightPaneFileName = useAtomValue(textViewRightPaneFileNameAtom);

  return (
    <Box display="flex" flexDirection="column" height="100%">
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
        setActiveSegmentIndex={setActiveSegmentIndex}
        setActiveSegmentId={setActiveSegmentId}
        activeSegmentIndex={activeSegmentIndex}
        isRightPane={true}
      />
    </Box>
  );
};
