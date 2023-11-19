import React from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
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

  return (
    <div style={{ overflow: "scroll", height: "100%" }}>
      <ClearSelectedSegmentButton />
      <p>{selectedSegmentMatches.length} Matches</p>
      <div style={{}}>
        {data?.map(
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
        )}
      </div>
    </div>
  );
}
