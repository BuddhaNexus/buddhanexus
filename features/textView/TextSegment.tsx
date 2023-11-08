// import { useRouter } from "next/router";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { sourceSans } from "@components/theme";
import { useColorScheme } from "@mui/material/styles";
import type { Scale } from "chroma-js";
import { scriptSelectionAtom } from "features/atoms";
import { enscriptText } from "features/sidebarSuite/common/dbSidebarHelpers";
import { useAtomValue } from "jotai";
import type { TextPageDataSegment } from "types/api/text";
import { useQueryParam } from "use-query-params";

import styles from "./textSegment.module.scss";

export const TextSegment = ({
  data: { segmentText, segmentNumber },
  // index,
  colorScale,
}: {
  data: TextPageDataSegment;
  index: number;
  colorScale: Scale;
}) => {
  const { mode } = useColorScheme();
  const isDarkTheme = mode === "dark";

  // const router = useRouter();
  const { sourceLanguage } = useDbQueryParams();
  const script = useAtomValue(scriptSelectionAtom);
  const [selectedSegmentId, setSelectedSegmentId] =
    useQueryParam("selectedSegment");

  const isSelected = selectedSegmentId === segmentNumber;

  return (
    <>
      <span
        className={`${styles.segmentNumber} ${
          isSelected && styles.segmentNumber__selected
        }`}
        data-segmentnumber={segmentNumber}
      />

      {segmentText.map(
        ({
          text,
          highlightColor,
          // matches
        }) => (
          <button
            key={text}
            type="button"
            tabIndex={0}
            // href={{
            //   pathname: "/db/[language]/[file]/text",
            //   query: {
            //     ...router.query,
            //     matches: matches.join(","),
            //     sort_method: "position",
            //   },
            // }}
            className={`${styles.segment} ${
              isSelected &&
              (isDarkTheme
                ? styles.segment__selected__dark
                : styles.segment__selected__light)
            }`}
            style={{
              fontFamily: sourceSans.style.fontFamily,
              color: colorScale(highlightColor).hex(),
            }}
            onClick={() => setSelectedSegmentId(segmentNumber)}
            onKeyDown={(event) => {
              // allow selecting the segments by pressing space or enter
              if (event.key !== " " && event.key !== "Enter") return;
              event.preventDefault();
              setSelectedSegmentId(segmentNumber);
            }}
          >
            {enscriptText({ text, script, language: sourceLanguage })}
          </button>
        ),
      )}
    </>
  );
};
