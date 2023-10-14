// import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { sourceSans } from "@components/theme";
import type { Scale } from "chroma-js";
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
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  // const router = useRouter();

  const [selectedSegmentId, setSelectedSegmentId] =
    useQueryParam("selectedSegment");

  const isSelected = selectedSegmentId === segmentNumber;

  return (
    <>
      <span
        className={`${styles.segmentNumber} ${
          isSelected && styles.segmentNumber__selected
        }`}
        data-segmentNumber={segmentNumber}
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
            {text}
          </button>
        )
      )}
    </>
  );
};
