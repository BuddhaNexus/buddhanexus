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
            className={styles.segment}
            style={{ color: colorScale(highlightColor).hex() }}
            onClick={() => setSelectedSegmentId(segmentNumber)}
            onKeyDown={() => setSelectedSegmentId(segmentNumber)}
          >
            {text}
          </span>
        )
      )}
    </section>
  );
};
