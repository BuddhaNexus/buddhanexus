import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { activeSegmentMatchesAtom, hoveredOverParallelIdAtom } from "@atoms";
import LoadingSpinner from "@components/common/LoadingSpinner";
import {
  useActiveSegmentIndexParam,
  useActiveSegmentParam,
} from "@components/hooks/params";
import { ParallelSegment } from "@features/tableView/ParallelSegment";
import { Numbers } from "@mui/icons-material";
import { Box, CardContent, CardHeader, Chip, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { useAtomValue, useSetAtom } from "jotai";

import { CloseTextViewPaneButton } from "./CloseTextViewPaneButton";
import styles from "./textViewMiddleParallels.module.scss";

export default function TextViewMiddleParallels() {
  const { t } = useTranslation();

  const activeSegmentMatches = useAtomValue(activeSegmentMatchesAtom);
  const setHoveredOverParallelId = useSetAtom(hoveredOverParallelIdAtom);

  const { data, isLoading } = useQuery({
    queryKey: DbApi.TextViewMiddle.makeQueryKey(activeSegmentMatches),
    queryFn: () =>
      DbApi.TextViewMiddle.call({ parallel_ids: activeSegmentMatches }),
    enabled: activeSegmentMatches.length > 0,
  });

  const [activeSegment, setActiveSegment] = useActiveSegmentParam();
  const [activeSegmentIndex, setActiveSegmentIndex] =
    useActiveSegmentIndexParam();

  const handleClear = async () => {
    await Promise.all([setActiveSegment("none"), setActiveSegmentIndex(null)]);
  };

  const parallelsToDisplay = useMemo(
    () =>
      data
        // hide empty parallels
        ?.filter((parallel) => parallel.parallelFullText)
        .map(
          (
            {
              id,
              fileName,
              displayName,
              parallelLength,
              parallelFullText,
              parallelSegmentNumber,
              parallelSegmentNumberRange,
              score,
              targetLanguage,
            },
            index,
          ) => (
            <ParallelSegment
              key={fileName + score + parallelLength + index}
              id={id}
              displayName={displayName}
              language={targetLanguage}
              length={parallelLength}
              text={parallelFullText}
              score={score}
              textSegmentNumber={parallelSegmentNumber}
              textSegmentNumberRange={parallelSegmentNumberRange}
              onHover={setHoveredOverParallelId}
            />
          ),
        ),
    [data, setHoveredOverParallelId],
  );

  return (
    <Box className={styles.container}>
      <LoadingSpinner isLoading={isLoading} />

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
        title={
          <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
            <Chip
              label={`${activeSegment} / ${activeSegmentIndex}`}
              variant="filled"
              color="secondary"
            />
            <Chip
              label={`${activeSegmentMatches.length} ${t("db.segmentMatches")}`}
              variant="outlined"
              icon={<Numbers />}
            />
          </Stack>
        }
      />

      <CardContent className={styles.cardContent}>
        {parallelsToDisplay}
      </CardContent>
    </Box>
  );
}
