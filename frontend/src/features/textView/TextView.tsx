import "allotment/dist/style.css";

import React, { useEffect, useRef } from "react";
import {
  useActiveSegmentParam,
  useRightPaneActiveSegmentParam,
} from "@components/hooks/params";
import { DEFAULT_PARAM_VALUES } from "@features/SidebarSuite/uiSettings/config";
import { TextViewLeftPane } from "@features/textView/TextViewLeftPane";
import { TextViewRightPane } from "@features/textView/TextViewRightPane";
import { Paper } from "@mui/material";
import { Allotment, AllotmentHandle, LayoutPriority } from "allotment";

import TextViewMiddleParallels from "./TextViewMiddleParallels";

// todo: check other elements in segmentText
export const TextView = () => {
  const [activeSegmentId] = useActiveSegmentParam();
  const [rightPaneActiveSegmentId] = useRightPaneActiveSegmentParam();

  const allotmentRef = useRef<AllotmentHandle>(null);

  const shouldShowMiddlePane = activeSegmentId !== "none";

  const shouldShowRightPane =
    rightPaneActiveSegmentId !== DEFAULT_PARAM_VALUES.active_segment;

  useEffect(
    // when the right pane opens, reset the layout so that each pane takes a proportional amount of the screen width.
    function resetPaneSize() {
      if (shouldShowRightPane) {
        allotmentRef.current?.reset();
      }
    },
    [shouldShowRightPane],
  );

  return (
    <Paper sx={{ flex: 1, mt: 2, height: "100%" }}>
      <Allotment ref={allotmentRef}>
        {/* Left pane - text (main view) */}
        <Allotment.Pane priority={LayoutPriority.High}>
          <TextViewLeftPane />
        </Allotment.Pane>

        {/* Middle pane - parallels for selected segment */}
        <Allotment.Pane visible={shouldShowMiddlePane}>
          <TextViewMiddleParallels />
        </Allotment.Pane>

        {/* Right Pane - shown after a parallel is selected in middle pane */}
        <Allotment.Pane visible={shouldShowRightPane}>
          <TextViewRightPane />
        </Allotment.Pane>
      </Allotment>
    </Paper>
  );
};

TextView.displayName = "TextView";
