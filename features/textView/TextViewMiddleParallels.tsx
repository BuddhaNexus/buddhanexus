import React, { useMemo } from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Numbers } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { selectedSegmentMatchesAtom } from "features/atoms/textView";
import { ParallelSegment } from "features/tableView/ParallelSegment";
import { useAtomValue } from "jotai";
import { TextViewMiddleParallelsData } from "types/api/text";
import { DbApi } from "utils/api/dbApi";

import { ClearSelectedSegmentButton } from "./ClearSelectedSegmentButton";

export default function TextViewMiddleParallels() {
  // eslint-disable-next-line no-empty-pattern
  const {
    // sourceLanguage, fileName, queryParams
  } = useDbQueryParams();

  const selectedSegmentMatches = useAtomValue(selectedSegmentMatchesAtom);

  const { data } = useQuery<TextViewMiddleParallelsData>({
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
        overflow: "scroll",
        height: "100%",
        paddingRight: 8,
        paddingLeft: 8,
      }}
    >
      <div
        data-testid="middle-view-header"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Chip
          label={`${selectedSegmentMatches.length} Matches`}
          variant="outlined"
          size="small"
          icon={<Numbers />}
        />
        <div>
          <ClearSelectedSegmentButton />
        </div>
      </div>

      <div>{parallelsToDisplay}</div>
    </div>
  );
}
