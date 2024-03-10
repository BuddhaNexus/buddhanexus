import { useCallback, useLayoutEffect } from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import {
  shouldShowSegmentNumbersAtom,
  shouldUseOldSegmentColorsAtom,
} from "@components/hooks/useDbView";
import { sourceSans } from "@components/theme";
import { useColorScheme } from "@mui/material/styles";
import type { Scale } from "chroma-js";
import { scriptSelectionAtom } from "features/atoms";
import { selectedSegmentMatchesAtom } from "features/atoms/textView";
import { enscriptText } from "features/sidebarSuite/common/dbSidebarHelpers";
import { useAtomValue, useSetAtom } from "jotai";
import type { TextPageDataSegment } from "types/api/text";
import { NumberParam, StringParam, useQueryParam } from "use-query-params";

import { OLD_WEBSITE_SEGMENT_COLORS } from "./constants";
import styles from "./textSegment.module.scss";

export const TextSegment = ({
  data: { segmentText, segmentNumber },
  colorScale,
}: {
  data: TextPageDataSegment;
  colorScale: Scale;
}) => {
  const { mode } = useColorScheme();
  const isDarkTheme = mode === "dark";

  const [selectedSegmentId, setSelectedSegmentId] = useQueryParam(
    "selectedSegment",
    StringParam,
  );
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useQueryParam(
    "selectedSegmentIndex",
    NumberParam,
  );
  const { sourceLanguage } = useDbQueryParams();

  const shouldUseOldSegmentColors = useAtomValue(shouldUseOldSegmentColorsAtom);
  const shouldShowSegmentNumbers = useAtomValue(shouldShowSegmentNumbersAtom);
  const scriptSelection = useAtomValue(scriptSelectionAtom);
  const setSelectedSegmentMatches = useSetAtom(selectedSegmentMatchesAtom);

  const isSegmentSelected = selectedSegmentId === segmentNumber;

  const updateSelectedLocationInGlobalState = useCallback(
    (location: { id: string; index: number; matches: string[] }) => {
      setSelectedSegmentId(location.id);
      setSelectedSegmentIndex(location.index);
    },
    [setSelectedSegmentId, setSelectedSegmentIndex],
  );

  // find matches for the selected segment when the page is first rendered
  useLayoutEffect(() => {
    if (!isSegmentSelected || typeof selectedSegmentIndex !== "number") return;
    const locationFromQueryParams = segmentText[selectedSegmentIndex];
    if (!locationFromQueryParams) return;
    setSelectedSegmentMatches(locationFromQueryParams.matches);
  }, [
    isSegmentSelected,
    segmentText,
    selectedSegmentId,
    selectedSegmentIndex,
    setSelectedSegmentMatches,
  ]);

  return (
    <>
      <span
        className={`${styles.segmentNumber} ${
          isSegmentSelected && styles["segmentNumber--selected"]
        } ${!shouldShowSegmentNumbers && styles["segmentNumber--hidden"]}`}
        data-segmentnumber={segmentNumber}
      />

      {segmentText.map(({ text, highlightColor, matches }, i) => {
        const segmentKey = segmentNumber + i;
        const textContent = enscriptText({
          text,
          script: scriptSelection,
          language: sourceLanguage,
        });
        const isSegmentPartSelected =
          isSegmentSelected && selectedSegmentIndex === i;

        if (matches.length === 0) {
          return (
            <span key={segmentKey} className={styles.segment}>
              {textContent}
            </span>
          );
        }
        return (
          <button
            key={segmentKey}
            type="button"
            tabIndex={0}
            className={`${styles.segment} ${styles["segment--button"]} ${
              isSegmentPartSelected &&
              (isDarkTheme
                ? styles["segment--selected-dark"]
                : styles["segment--selected-light"])
            }`}
            style={{
              fontFamily: sourceSans.style.fontFamily,
              color: shouldUseOldSegmentColors
                ? OLD_WEBSITE_SEGMENT_COLORS[highlightColor]
                : colorScale(highlightColor).hex(),
            }}
            onClick={() => {
              updateSelectedLocationInGlobalState({
                id: segmentNumber,
                matches,
                index: i,
              });
            }}
            onKeyDown={(event) => {
              // allow selecting the segments by pressing space or enter
              if (event.key !== " " && event.key !== "Enter") return;
              event.preventDefault();
              updateSelectedLocationInGlobalState({
                id: segmentNumber,
                matches,
                index: i,
              });
            }}
          >
            {textContent}
          </button>
        );
      })}
    </>
  );
};
