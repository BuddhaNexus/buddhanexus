import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import {
  shouldHideSegmentNumbersAtom,
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
import { useQueryParam } from "use-query-params";

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

  const [selectedSegmentId, setSelectedSegmentId] =
    useQueryParam("selectedSegment");
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useQueryParam(
    "selectedSegmentIndex",
  );
  const { sourceLanguage } = useDbQueryParams();

  const shouldUseOldSegmentColors = useAtomValue(shouldUseOldSegmentColorsAtom);
  const shouldHideSegmentNumbers = useAtomValue(shouldHideSegmentNumbersAtom);
  const scriptSelection = useAtomValue(scriptSelectionAtom);
  const setSelectedSegmentMatches = useSetAtom(selectedSegmentMatchesAtom);

  const isSegmentSelected = selectedSegmentId === segmentNumber;

  return (
    <>
      <span
        className={`${styles.segmentNumber} ${
          isSegmentSelected && styles["segmentNumber--selected"]
        } ${shouldHideSegmentNumbers && styles["segmentNumber--hidden"]}`}
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
          isSegmentSelected &&
          typeof selectedSegmentIndex === "string" &&
          Number.parseInt(selectedSegmentIndex, 10) === i;

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
              setSelectedSegmentMatches(matches);
              setSelectedSegmentId(segmentNumber);
              setSelectedSegmentIndex(i);
            }}
            onKeyDown={(event) => {
              // allow selecting the segments by pressing space or enter
              if (event.key !== " " && event.key !== "Enter") return;
              event.preventDefault();
              setSelectedSegmentMatches(matches);
              setSelectedSegmentId(segmentNumber);
              setSelectedSegmentIndex(i);
            }}
          >
            {textContent}
          </button>
        );
      })}
    </>
  );
};
