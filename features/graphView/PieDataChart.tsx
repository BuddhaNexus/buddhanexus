import React, { memo } from "react";
import { Chart, GoogleChartWrapperChartType } from "react-google-charts";
import { useTranslation } from "next-i18next";
import { GraphPageGraphData } from "utils/api/endpoints/graph-view/graph";

import { GRAPH_BG_COLOR } from "./constants";

interface Props {
  data?: GraphPageGraphData;
  chartType?: GoogleChartWrapperChartType;
}

export const PieDataChart = memo<Props>(function PieDataChart({
  data,
  chartType = "PieChart",
}) {
  const { t } = useTranslation();

  return (
    <Chart
      chartType={chartType}
      data={[[t("graph.collection"), t("graph.matchLengths")], ...(data ?? [])]}
      graph_id="pie-chart"
      options={{
        is3D: true,
        backgroundColor: GRAPH_BG_COLOR,
        chartArea: { height: "80%", width: "100%" },
      }}
      style={{ paddingTop: "8px" }}
      width="100%"
      height="100%"
    />
  );
});
