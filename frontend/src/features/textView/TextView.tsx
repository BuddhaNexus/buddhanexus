import "allotment/dist/style.css";

import React from "react";
import { activeSegmentMatchesAtom } from "@atoms";
import {
  useActiveSegmentParam,
  useRightPaneActiveSegmentParam,
} from "@components/hooks/params";
import { DEFAULT_PARAM_VALUES } from "@features/SidebarSuite/uiSettings/config";
import { TextViewRightPane } from "@features/textView/TextViewRightPane";
import { Paper } from "@mui/material";
import { ParsedTextViewParallels } from "@utils/api/endpoints/text-view/text-parallels";
import { Allotment, LayoutPriority } from "allotment";
import { useAtomValue } from "jotai/index";

import { TextViewLeftPane } from "./TextViewLeftPane";
import TextViewMiddleParallels from "./TextViewMiddleParallels";

export interface TextViewProps {
  data: ParsedTextViewParallels;
  onEndReached: () => void;
  onStartReached: () => Promise<void>;
  firstItemIndex?: number;
  isFetchingPreviousPage?: boolean;
  isFetchingNextPage?: boolean;
}

// todo: check other elements in segmentText
export const TextView = ({
  data,
  onEndReached,
  onStartReached,
  firstItemIndex,
  isFetchingPreviousPage,
  isFetchingNextPage,
}: TextViewProps) => {
  const [activeSegmentId] = useActiveSegmentParam();
  const [rightPaneActiveSegmentId] = useRightPaneActiveSegmentParam();
  const activeSegmentMatches = useAtomValue(activeSegmentMatchesAtom);

  const shouldShowMiddlePane =
    activeSegmentId !== "none" && activeSegmentMatches.length > 0;

  const shouldShowRightPane =
    rightPaneActiveSegmentId !== DEFAULT_PARAM_VALUES.active_segment;

  return (
    <Paper sx={{ flex: 1, mt: 2, height: "100%" }} elevation={1}>
      <Allotment>
        {/* Left pane - text (main view) */}
        <Allotment.Pane priority={LayoutPriority.High}>
          <TextViewLeftPane
            data={data}
            firstItemIndex={firstItemIndex}
            isFetchingPreviousPage={isFetchingPreviousPage}
            isFetchingNextPage={isFetchingNextPage}
            onEndReached={onEndReached}
            onStartReached={onStartReached}
          />
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
