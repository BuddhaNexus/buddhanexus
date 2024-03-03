import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { Numbers } from "@mui/icons-material";
import { Chip, CircularProgress, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { selectedSegmentMatchesAtom } from "features/atoms/textView";
import { ParallelSegment } from "features/tableView/ParallelSegment";
import { useAtomValue } from "jotai";
import { TextViewMiddleParallelsData } from "types/api/text";
import { DbApi } from "utils/api/dbApi";

import { ClearSelectedSegmentButton } from "./ClearSelectedSegmentButton";

export default function TextViewMiddleParallels() {
  const { t } = useTranslation();

  const selectedSegmentMatches = useAtomValue(selectedSegmentMatchesAtom);

  const { data, isLoading } = useQuery<TextViewMiddleParallelsData>({
    queryKey: DbApi.TextViewMiddle.makeQueryKey(selectedSegmentMatches),
    queryFn: () => DbApi.TextViewMiddle.call(selectedSegmentMatches),
  });

  const parallelsToDisplay = useMemo(
    () =>
      data
        // hide empty parallels
        ?.filter((parallel) => parallel.parallelFullText)
        .map(
          ({
            fileName,
            parallelLength,
            parallelFullText,
            parallelSegmentNumbers,
            score,
            targetLanguage,
          }) => (
            <ParallelSegment
              key={fileName + score + parallelLength}
              displayName={fileName}
              language={targetLanguage}
              length={parallelLength}
              text={parallelFullText}
              score={score}
              textSegmentNumbers={parallelSegmentNumbers}
            />
          ),
        ),
    [data],
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
      <Paper
        data-testid="middle-view-header"
        elevation={2}
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1,
          padding: 4,
        }}
      >
        <Chip
          label={`${selectedSegmentMatches.length} ${t("db.matches")}`}
          variant="outlined"
          icon={<Numbers />}
        />
        <div>
          <ClearSelectedSegmentButton />
        </div>
      </Paper>

      <div>{parallelsToDisplay}</div>
    </div>
  );
}
