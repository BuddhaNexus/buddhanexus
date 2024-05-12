import React, { memo } from "react";
import { Chart, GoogleChartWrapperChartType } from "react-google-charts";
import { useTranslation } from "next-i18next";
import { useTheme } from "@mui/material/styles";
import { GraphPageGraphData } from "types/api/common";

import { GRAPH_BG_COLOR } from "./constants";

interface Props {
  data: GraphPageGraphData;
  chartType?: GoogleChartWrapperChartType;
}

export const HistogramDataChart = memo<Props>(function HistogramDataChart({
  data,
  chartType = "Histogram",
}) {
  const { palette } = useTheme();
  const { t } = useTranslation();

  const isScatterChart = chartType === "ScatterChart";

  return (
    <Chart
      chartType={chartType}
      data={[[t("graph.collection"), t("graph.matchLengths")], ...data]}
      graph_id={`histogram-${chartType}-chart`}
      options={{
        colors: [palette.secondary.main],
        legend: { position: "none" },
        backgroundColor: GRAPH_BG_COLOR,
        chartArea: { width: "80%", height: "80%" },
        vAxis: { scaleType: isScatterChart ? "log" : undefined },
      }}
      height="100%"
    />
  );
});
