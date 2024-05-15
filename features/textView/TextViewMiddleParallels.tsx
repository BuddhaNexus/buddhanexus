import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { Numbers } from "@mui/icons-material";
import { Chip, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
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

  const theme = useTheme();

  const { data, isLoading } = useQuery<TextViewMiddleParallelsData>({
    queryKey: DbApi.TextViewMiddle.makeQueryKey(selectedSegmentMatches),
    queryFn: () => DbApi.TextViewMiddle.call(selectedSegmentMatches),
    enabled: selectedSegmentMatches.length > 0,
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
            parallelSegmentNumbers,
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
              textSegmentNumberRange={parallelSegmentNumbers}
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
          label={`${selectedSegmentMatches.length} ${t("db.segmentMatches")}`}
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
