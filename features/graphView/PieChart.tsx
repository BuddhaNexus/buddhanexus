import React, { memo } from "react";
import { Chart } from "react-google-charts";
import { useTranslation } from "next-i18next";
import { useTheme } from "@mui/material/styles";
import { GraphPageGraphData } from "types/api/common";

interface Props {
  data?: GraphPageGraphData;
}

export const PieChart = memo<Props>(function PieChart({ data }) {
  const { t } = useTranslation();
  const { palette } = useTheme();

  return (
    <Chart
      chartType="PieChart"
      data={[[t("graph.collection"), t("graph.matchLengths")], ...(data ?? [])]}
      graph_id="pie-chart"
      options={{
        is3D: true,
        backgroundColor: palette.background.default,
        chartArea: { height: "80%" },
      }}
      style={{ paddingTop: "8px" }}
      width="100%"
      height="100%"
    />
  );
});
