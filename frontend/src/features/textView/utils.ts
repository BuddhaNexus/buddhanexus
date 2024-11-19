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
