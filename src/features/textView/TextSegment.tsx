import { useCallback, useLayoutEffect } from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import {
  shouldShowSegmentNumbersAtom,
  shouldUseOldSegmentColorsAtom,
} from "@components/hooks/useDbView";
import { sourceSans } from "@components/theme";
import { scriptSelectionAtom } from "@features/atoms";
import { selectedSegmentMatchesAtom } from "@features/atoms/textView";
import { enscriptText } from "@features/sidebarSuite/common/dbSidebarHelpers";
import { useColorScheme } from "@mui/material/styles";
import { ParsedTextViewParallel } from "@utils/api/endpoints/text-view/text-parallels";
import type { Scale } from "chroma-js";
import { useAtomValue, useSetAtom } from "jotai";
import { NumberParam, StringParam, useQueryParam } from "use-query-params";

import { OLD_WEBSITE_SEGMENT_COLORS } from "./constants";
import styles from "./textSegment.module.scss";

export const TextSegment = ({
  data,
  colorScale,
}: {
  data?: ParsedTextViewParallel;
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

  const isSegmentSelected = selectedSegmentId === data?.segmentNumber;

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
    const locationFromQueryParams = data?.segmentText[selectedSegmentIndex];
    if (!locationFromQueryParams) return;
    setSelectedSegmentMatches(locationFromQueryParams.matches as string[]);
  }, [
    isSegmentSelected,
    data?.segmentText,
    selectedSegmentId,
    selectedSegmentIndex,
    setSelectedSegmentMatches,
  ]);

  return (
    <div className={styles.segmentWrapper}>
      <span
        className={`${styles.segmentNumber} ${
          isSegmentSelected && styles["segmentNumber--selected"]
        } ${!shouldShowSegmentNumbers && styles["segmentNumber--hidden"]}`}
        data-segmentnumber={data?.segmentNumber}
      />

      {data?.segmentText.map(({ text, highlightColor, matches }, i) => {
        const segmentKey = data?.segmentNumber + i;
        const textContent = enscriptText({
          text,
          script: scriptSelection,
          language: sourceLanguage,
        });
        const isSegmentPartSelected =
          isSegmentSelected && selectedSegmentIndex === i;

        if (!matches || matches.length === 0) {
          return (
            <span key={segmentKey} className={styles.segment}>
              {textContent}
            </span>
          );
        }

        const color = shouldUseOldSegmentColors
          ? ((highlightColor &&
              OLD_WEBSITE_SEGMENT_COLORS[highlightColor]) as string) ??
            OLD_WEBSITE_SEGMENT_COLORS.at(-1)
          : colorScale(highlightColor).hex();

        return (
          <button
            key={segmentKey}
            type="button"
            tabIndex={0}
            className={`${styles.segment} ${styles.segment__button} ${
              isDarkTheme && styles["segment--dark"]
            } ${isSegmentPartSelected && styles["segment--selected"]}`}
            style={{
              fontFamily: sourceSans.style.fontFamily,
              color,
            }}
            onClick={() => {
              if (!matches) return;
              updateSelectedLocationInGlobalState({
                id: data?.segmentNumber,
                matches: matches as string[],
                index: i,
              });
            }}
            onKeyDown={(event) => {
              // allow selecting the segments by pressing space or enter
              if (event.key !== " " && event.key !== "Enter") return;
              event.preventDefault();
              updateSelectedLocationInGlobalState({
                id: data?.segmentNumber,
                matches: matches as string[],
                index: i,
              });
            }}
          >
            {textContent}
          </button>
        );
      })}
    </div>
  );
};
