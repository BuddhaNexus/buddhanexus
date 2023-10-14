/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
// import { useRouter } from "next/router";
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
  // const router = useRouter();

  const [selectedSegmentId, setSelectedSegmentId] =
    useQueryParam("selectedSegment");

  const isSelected = selectedSegmentId === segmentNumber;

  return (
    <section
      style={{ display: "inline" }}
      className={`${styles.segmentContainer} ${
        isSelected && styles.segmentContainer__selected
      }`}
    >
      <span
        className={styles.segmentNumber}
        data-segmentNumber={segmentNumber}
      />
      {segmentText.map(
        ({
          text,
          highlightColor,
          // matches
        }) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <span
            key={text}
            role="figure"
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
              isSelected && styles.segment__selected
            }`}
            style={{
              color: colorScale(highlightColor).hex(),
              wordWrap: "break-word",
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
          </span>
        )
      )}
    </section>
  );
};
