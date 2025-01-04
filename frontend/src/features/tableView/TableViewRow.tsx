import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Divider, Stack } from "@mui/material";
import type { ParsedTableViewParallel } from "@utils/api/endpoints/table-view/table";

import { ParallelSegment } from "./ParallelSegment";

export const TableViewRow = ({
  parallel: {
    parallelLength,
    parallelFullNames,
    parallelFullText,
    parallelSegmentNumberRange,
    rootSegmentNumberRange,
    rootFullNames,
    rootFullText,
    rootLength,
    dbLanguage,
    targetLanguage,
    score,
  },
}: {
  parallel: ParsedTableViewParallel;
}) => {
  const { parallelStackDirection, parallelArrowTransform } =
    useSettingsDrawer();

  const [rootSegmentNumber] = rootSegmentNumberRange.split("-");
  const [parallelSegmentNumber] = parallelSegmentNumberRange.split("-");
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
          textSegmentNumber={rootSegmentNumber ?? ""}
          textSegmentNumberRange={rootSegmentNumberRange}
          isRowItem
        />

        <ArrowDownwardIcon sx={{ transform: parallelArrowTransform }} />

        {/* PARALLEL SEGMENT*/}
        <ParallelSegment
          displayName={parallelFullNames.displayName}
          language={dbLanguage}
          length={parallelLength}
          text={parallelFullText}
          score={score}
          textSegmentNumber={parallelSegmentNumber ?? ""}
          textSegmentNumberRange={parallelSegmentNumberRange}
          isRowItem
        />
      </Stack>
      <Divider />
    </>
  );
};
