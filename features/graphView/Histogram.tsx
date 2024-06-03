import React, { memo } from "react";
import { Chart } from "react-google-charts";
import { useTranslation } from "next-i18next";
import { useTheme } from "@mui/material/styles";
import { GraphPageGraphData } from "utils/api/endpoints/graph-view/graph";

interface Props {
  data?: GraphPageGraphData;
}

const HISTOGRAM_LOWER_MATCH_LIMIT = 500;

export const Histogram = memo<Props>(function Histogram({ data }) {
  const { palette } = useTheme();
  const { t } = useTranslation();

  const filteredHistogramData =
    data?.filter((item) => item[1] > HISTOGRAM_LOWER_MATCH_LIMIT) ?? [];

  return (
    <Chart
      chartType="Histogram"
      data={[
        [t("graph.collection"), t("graph.matchLengths")],
        ...filteredHistogramData,
      ]}
      graph_id="histogram-chart"
      options={{
        title: t("graph.title"),
        histogram: { lastBucketPercentile: 2 },
        colors: [palette.secondary.main],
        vAxis: { scaleType: "mirrorLog" },
        legend: { position: "none" },
        backgroundColor: palette.background.default,
        chartArea: { width: "80%", height: "80%" },
      }}
      height="100%"
      legendToggle
    />
  );
});
