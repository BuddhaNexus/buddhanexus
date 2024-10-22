import { useCallback, useLayoutEffect } from "react";
import {
  activeSegmentMatchesAtom,
  scriptSelectionAtom,
  shouldShowSegmentNumbersAtom,
  shouldUseMonochromaticSegmentColorsAtom,
} from "@atoms";
import { useActiveSegmentParam } from "@components/hooks/params";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { sourceSans } from "@components/theme";
import { enscriptText } from "@features/SidebarSuite/utils";
import { useColorScheme } from "@mui/material/styles";
import { ParsedTextViewParallel } from "@utils/api/endpoints/text-view/text-parallels";
import type { Scale } from "chroma-js";
import { useAtomValue, useSetAtom } from "jotai";
import { parseAsInteger, useQueryState } from "nuqs";

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

  const [activeSegmentId, setActiveSegmentId] = useActiveSegmentParam();
  const [activeSegmentIndex, setActiveSegmentIndex] = useQueryState(
    "active_segment_index",
    parseAsInteger,
  );

  const { dbLanguage } = useDbRouterParams();

  const shouldUseMonochromaticSegmentColors = useAtomValue(
    shouldUseMonochromaticSegmentColorsAtom,
  );
  const shouldShowSegmentNumbers = useAtomValue(shouldShowSegmentNumbersAtom);
  const setSelectedSegmentMatches = useSetAtom(activeSegmentMatchesAtom);
  const isSegmentSelected = activeSegmentId === data?.segmentNumber;

  const scriptSelection = useAtomValue(scriptSelectionAtom);

  const updateSelectedLocationInGlobalState = useCallback(
    async (location: { id: string; index: number; matches: string[] }) => {
      await setActiveSegmentId(location.id);
      await setActiveSegmentIndex(location.index);
    },
    [setActiveSegmentId, setActiveSegmentIndex],
  );

  // find matches for the selected segment when the page is first rendered
  useLayoutEffect(() => {
    if (!isSegmentSelected || typeof activeSegmentIndex !== "number") return;
    const locationFromQueryParams = data?.segmentText[activeSegmentIndex];
    if (!locationFromQueryParams) return;
    setSelectedSegmentMatches(locationFromQueryParams.matches as string[]);
  }, [
    isSegmentSelected,
    data?.segmentText,
    activeSegmentId,
    activeSegmentIndex,
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
          language: dbLanguage,
        });
        const isSegmentPartSelected =
          isSegmentSelected && activeSegmentIndex === i;

        if (!matches || matches.length === 0) {
          return (
            <span key={segmentKey} className={styles.segment}>
              {textContent}
            </span>
          );
        }

        const color = shouldUseMonochromaticSegmentColors
          ? colorScale(highlightColor).hex()
          : ((highlightColor &&
              OLD_WEBSITE_SEGMENT_COLORS[highlightColor]) as string) ??
            OLD_WEBSITE_SEGMENT_COLORS.at(-1);

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
            onClick={async () => {
              if (!matches) return;
              await updateSelectedLocationInGlobalState({
                id: data?.segmentNumber,
                matches: matches as string[],
                index: i,
              });
            }}
            onKeyDown={async (event) => {
              // allow selecting the segments by pressing space or enter
              if (event.key !== " " && event.key !== "Enter") return;
              event.preventDefault();
              await updateSelectedLocationInGlobalState({
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
