import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { activeSegmentMatchesAtom, hoveredOverParallelIdAtom } from "@atoms";
import {
  useActiveSegmentIndexParam,
  useActiveSegmentParam,
} from "@components/hooks/params";
import { ParallelSegment } from "@features/tableView/ParallelSegment";
import { Numbers } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
} from "@mui/material";
import Box from "@mui/material/Box";
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

  const [, setActiveSegment] = useActiveSegmentParam();
  const [, setActiveSegmentIndex] = useActiveSegmentIndexParam();

  const handleClear = async () => {
    await setActiveSegment("none");
    await setActiveSegmentIndex(null);
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
    <Card className={styles.container}>
      <CircularProgress
        className={styles.circularProgress}
        style={{ display: isLoading ? "block" : "none" }}
      />

      <CardHeader
        data-testid="middle-view-header"
        sx={{ position: "sticky" }}
        action={<CloseTextViewPaneButton handlePress={handleClear} />}
        subheader={
          <Chip
            label={`${activeSegmentMatches.length} ${t("db.segmentMatches")}`}
            variant="outlined"
            icon={<Numbers />}
          />
        }
      />

      <CardContent className={styles.cardContent}>
        {parallelsToDisplay}
      </CardContent>
    </Card>
  );
}
