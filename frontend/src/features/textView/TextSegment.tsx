import { useCallback, useLayoutEffect, useMemo } from "react";
import {
  activeSegmentMatchesAtom,
  hoveredOverParallelIdAtom,
  scriptSelectionAtom,
  shouldShowSegmentNumbersAtom,
  shouldUseMonochromaticSegmentColorsAtom,
} from "@atoms";
import {
  useActiveSegmentIndexParam,
  useActiveSegmentParam,
} from "@components/hooks/params";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { sourceSans } from "@components/theme";
import { enscriptText } from "@features/SidebarSuite/utils";
import { useColorScheme } from "@mui/material/styles";
import { ParsedTextViewParallel } from "@utils/api/endpoints/text-view/text-parallels";
import type { Scale } from "chroma-js";
import { useAtomValue, useSetAtom } from "jotai";

import { OLD_WEBSITE_SEGMENT_COLORS } from "./constants";
import styles from "./textSegment.module.scss";

export const TextSegment = ({
  data,
  colorScale,
  activeSegmentId,
  onClickFunction,
}: {
  data?: ParsedTextViewParallel;
  colorScale: Scale;
  activeSegmentId: string;
  onClickFunction: "open-matches" | "";
}) => {
  const { mode } = useColorScheme();
  const isDarkTheme = mode === "dark";

  const [, setActiveSegmentId] = useActiveSegmentParam();
  const [activeSegmentIndex, setActiveSegmentIndex] =
    useActiveSegmentIndexParam();

  const { dbLanguage } = useDbRouterParams();

  const shouldUseMonochromaticSegmentColors = useAtomValue(
    shouldUseMonochromaticSegmentColorsAtom,
  );
  const shouldShowSegmentNumbers = useAtomValue(shouldShowSegmentNumbersAtom);
  const hoveredOverParallelId = useAtomValue(hoveredOverParallelIdAtom);
  const setSelectedSegmentMatches = useSetAtom(activeSegmentMatchesAtom);
  const isSegmentSelected = activeSegmentId === data?.segmentNumber;

  const scriptSelection = useAtomValue(scriptSelectionAtom);

  const updateSelectedLocationInGlobalState = useCallback(
    async (location: { id: string; index: number; matches: string[] }) => {
      await Promise.all([
        // todo: update what happens when a segment is clicked
        setActiveSegmentId(location.id),
        setActiveSegmentIndex(location.index),
      ]);
    },
    [setActiveSegmentId, setActiveSegmentIndex],
  );

  // find matches for the selected segment when the page is first rendered
  useLayoutEffect(() => {
    if (
      !isSegmentSelected ||
      typeof activeSegmentIndex !== "number" ||
      onClickFunction !== "open-matches"
    )
      return;
    const locationFromQueryParams = data?.segmentText[activeSegmentIndex];
    if (!locationFromQueryParams) return;
    setSelectedSegmentMatches(locationFromQueryParams.matches);
  }, [
    isSegmentSelected,
    data?.segmentText,
    activeSegmentId,
    activeSegmentIndex,
    setSelectedSegmentMatches,
    onClickFunction,
  ]);

  const matchSets = useMemo(() => {
    // optimisation - don't run the map function if there are no active segments (middle view is closed)
    if (activeSegmentId === "none") return undefined;
    return data?.segmentText.map((textChunk) => new Set(textChunk.matches));
  }, [activeSegmentId, data?.segmentText]);

  if (!data) return null;

  // segnr also contains the file name - we need to strip it away
  const [, segmentNumber] = data.segmentNumber.split(":");

  return (
    <div className={styles.segmentWrapper}>
      <span
        className={`${styles.segmentNumber} ${
          isSegmentSelected && styles["segmentNumber--selected"]
        } ${!shouldShowSegmentNumbers && styles["segmentNumber--hidden"]}`}
        data-segmentnumber={segmentNumber}
      />

      {data.segmentText.map(({ text, highlightColor, matches }, i) => {
        const segmentKey = segmentNumber ? segmentNumber + i : undefined;
        const textContent = enscriptText({
          text,
          script: scriptSelection,
          language: dbLanguage,
        });
        const isSegmentPartSelected =
          isSegmentSelected && activeSegmentIndex === i;

        const isSegmentPartHoveredOverInMiddleView = matchSets
          ? matchSets[i]?.has(hoveredOverParallelId)
          : false;

        if (matches.length === 0) {
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
            } ${isSegmentPartSelected && styles["segment--selected"]} ${isSegmentPartHoveredOverInMiddleView && styles["segment--parallel-hovered"]}`}
            style={{
              fontFamily: sourceSans.style.fontFamily,
              color,
            }}
            onClick={async () => {
              await updateSelectedLocationInGlobalState({
                id: data.segmentNumber,
                matches,
                index: i,
              });
            }}
            onKeyDown={async (event) => {
              // allow selecting the segments by pressing space or enter
              if (event.key !== " " && event.key !== "Enter") return;
              event.preventDefault();
              await updateSelectedLocationInGlobalState({
                id: data.segmentNumber,
                matches,
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
