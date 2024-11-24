import { ParsedTextViewParallels } from "@utils/api/endpoints/text-view/text-parallels";
import chroma from "chroma-js";

export function getTextViewColorScale(
  data: ParsedTextViewParallels,
): chroma.Scale {
  const colors = data.map((item) => item.segmentText[0]?.highlightColor ?? 0);
  const [minColor, maxColor] = [Math.min(...colors), Math.max(...colors)];

  return chroma
    .scale("Reds")
    .padding([0.6, 0])
    .domain([maxColor, minColor])
    .correctLightness(true);
}

export function findSegmentIndexInParallelsData(
  data: ParsedTextViewParallels,
  activeSegmentId: string,
) {
  if (data.length <= 0) return 0;
  const index = data.findIndex(
    (element) => element.segmentNumber === activeSegmentId,
  );
  if (index === -1) return 0;
  return index;
}

export type PaginationState = [startEdgePage?: number, endEdgePage?: number];
