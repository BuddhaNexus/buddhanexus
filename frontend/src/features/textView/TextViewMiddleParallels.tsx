import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { activeSegmentMatchesAtom } from "@atoms";
import { ParallelSegment } from "@features/tableView/ParallelSegment";
import { Numbers } from "@mui/icons-material";
import { Chip, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { useAtomValue } from "jotai";

import { ClearSelectedSegmentButton } from "./ClearSelectedSegmentButton";

export default function TextViewMiddleParallels() {
  const { t } = useTranslation();

  const activeSegmentMatches = useAtomValue(activeSegmentMatchesAtom);

  const theme = useTheme();

  const { data, isLoading } = useQuery({
    queryKey: DbApi.TextViewMiddle.makeQueryKey(activeSegmentMatches),
    queryFn: () =>
      DbApi.TextViewMiddle.call({ parallel_ids: activeSegmentMatches }),
    enabled: activeSegmentMatches.length > 0,
  });

  const parallelsToDisplay = useMemo(
    () =>
      data
        // hide empty parallels
        ?.filter((parallel) => parallel.parallelFullText)
        .map(
          ({
            fileName,
            displayName,
            parallelLength,
            parallelFullText,
            parallelSegmentNumberRange,
            score,
            targetLanguage,
          }) => (
            <ParallelSegment
              key={fileName + score + parallelLength}
              displayName={displayName}
              language={targetLanguage}
              length={parallelLength}
              text={parallelFullText}
              score={score}
              textSegmentNumberRange={parallelSegmentNumberRange}
            />
          )
        ),
    [data]
  );

  return (
    <div
      style={{
        overflow: "auto",
        height: "100%",
        flex: 1,
        paddingRight: 8,
        paddingLeft: 8,
      }}
    >
      <CircularProgress
        style={{
          display: isLoading ? "block" : "none",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <Box
        data-testid="middle-view-header"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          position: "sticky",
          backgroundColor: theme.palette.background.paper,
          top: 0,
          zIndex: 1,
          padding: 4,
        }}
      >
        <Chip
          label={`${activeSegmentMatches.length} ${t("db.segmentMatches")}`}
          variant="outlined"
          icon={<Numbers />}
        />
        <div>
          <ClearSelectedSegmentButton />
        </div>
      </Box>

      <div>{parallelsToDisplay}</div>
    </div>
  );
}
