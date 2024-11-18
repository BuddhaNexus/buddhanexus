import React, { memo } from "react";
import { Chart, GoogleChartWrapperChartType } from "react-google-charts";
import { useTranslation } from "next-i18next";
import { PIE_COLOUR_SCALE } from "@features/graphView/constants";
import { useTheme } from "@mui/material";
import { GraphPageGraphData } from "@utils/api/endpoints/graph-view/graph";

import { DatasetWarning } from "./DatasetWarning";

interface Props {
  data?: GraphPageGraphData | null;
  chartType?: GoogleChartWrapperChartType;
}

export const PieDataChart = memo<Props>(function PieDataChart({
  data,
  chartType = "PieChart",
}) {
  const { t } = useTranslation();
  const { palette } = useTheme();

  if (!data || data.length === 0) {
    return <DatasetWarning />;
  }

  return (
    <Chart
      chartType={chartType}
      data={[[t("graph.collection"), t("graph.matchLengths")], ...data]}
      graph_id="pie-chart"
      options={{
        is3D: true,
        colors: PIE_COLOUR_SCALE,
        chartArea: { width: "98%", height: "80%" },
        legend: { textStyle: { color: palette.text.primary } },
        backgroundColor: palette.background.paper,
      }}
      style={{ minHeight: "500px" }}
      width="100%"
      height="100%"
    />
  );
});
