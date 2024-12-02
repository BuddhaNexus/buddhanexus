import "allotment/dist/style.css";

import React from "react";
import { activeSegmentMatchesAtom } from "@atoms";
import {
  useActiveSegmentParam,
  useRightPaneActiveSegmentParam,
} from "@components/hooks/params";
import { DEFAULT_PARAM_VALUES } from "@features/SidebarSuite/uiSettings/config";
import { TextViewLeftPane } from "@features/textView/TextViewLeftPane";
import { TextViewRightPane } from "@features/textView/TextViewRightPane";
import { Paper } from "@mui/material";
import { Allotment, LayoutPriority } from "allotment";
import { useAtomValue } from "jotai/index";

import TextViewMiddleParallels from "./TextViewMiddleParallels";

// todo: check other elements in segmentText
export const TextView = () => {
  const [activeSegmentId] = useActiveSegmentParam();
  const [rightPaneActiveSegmentId] = useRightPaneActiveSegmentParam();
  const activeSegmentMatches = useAtomValue(activeSegmentMatchesAtom);

  const shouldShowMiddlePane = activeSegmentId !== "none";

  const shouldShowRightPane =
    rightPaneActiveSegmentId !== DEFAULT_PARAM_VALUES.active_segment;

  return (
    <Paper sx={{ flex: 1, mt: 2, height: "100%" }}>
      <Allotment>
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
