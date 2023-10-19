import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Divider, Stack } from "@mui/material";
import type { TablePageParallel } from "types/api/table";

import { ParallelSegment } from "./ParallelSegment";

export const TableViewRow = ({
  parallel: {
    parallelLength,
    parallelFullNames,
    parallelFullText,
    parallelSegmentNumbers,
    rootSegmentNumbers,
    rootFullNames,
    rootFullText,
    rootLength,
    sourceLanguage,
    targetLanguage,
    score,
  },
}: {
  parallel: TablePageParallel;
}) => {
  const { parallelStackDirection, parallelArrowTransform } =
    useSettingsDrawer();
  return (
    <>
      <Stack
        direction={parallelStackDirection}
        spacing={2}
        sx={{ my: 2, py: 1, justifyContent: "center", alignItems: "center" }}
      >
        {/* ROOT SEGMENT */}
        <ParallelSegment
          displayName={rootFullNames.displayName}
          language={targetLanguage}
          length={rootLength}
          text={rootFullText}
          textSegmentNumbers={rootSegmentNumbers}
        />

        <ArrowDownwardIcon sx={{ transform: parallelArrowTransform }} />

        {/* PARALLEL SEGMENT*/}
        <ParallelSegment
          displayName={parallelFullNames.displayName}
          language={sourceLanguage}
          length={parallelLength}
          text={parallelFullText}
          score={score}
          textSegmentNumbers={parallelSegmentNumbers}
        />
      </Stack>
      <Divider />
    </>
  );
};
