import React, { memo } from "react";
import { Chart, GoogleChartWrapperChartType } from "react-google-charts";
import { useTranslation } from "next-i18next";
import { useTheme } from "@mui/material/styles";
import { GraphPageGraphData } from "utils/api/endpoints/graph-view/graph";

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
        backgroundColor: palette.background.paper,
        chartArea: { width: "85%", height: "80%" },
        vAxis: {
          scaleType: isScatterChart ? "log" : undefined,
          textStyle: { color: palette.text.primary },
        },
        hAxis: { textStyle: { color: palette.text.primary } },
      }}
      width="100%"
      height="100%"
    />
  );
});
