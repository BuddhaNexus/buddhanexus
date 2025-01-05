import React from "react";
import { Chart } from "react-google-charts";
import {
  useVisualCollectionStringParam,
  useVisualHitCollectionsStringParam,
} from "@components/hooks/params";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { visualChartColors } from "@features/visualView/visualChartUtils";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";

const chartOptions = {
  sankey: {
    iterations: 0,
    node: {
      width: 40,
      interactivity: true,
      nodePadding: 20,
      colors: visualChartColors,
      label: {
        fontSize: 14,
        bold: true,
      },
    },
    link: {
      colorMode: "gradient",
      fillOpacity: 0.4,
      colors: visualChartColors,
    },
  },
};

export const VisualViewChart = () => {
  const { dbLanguage } = useDbRouterParams();
  const [selectedCollection] = useVisualCollectionStringParam();
  const [selectedHitCollections] = useVisualHitCollectionsStringParam();

  const { data: graphData, isLoading } = useQuery({
    enabled: true,
    queryKey: DbApi.VisualViewGraphData.makeQueryKey(
      dbLanguage,
      selectedCollection,
      selectedHitCollections,
    ),
    queryFn: () =>
      DbApi.VisualViewGraphData.call(
        dbLanguage,
        selectedCollection,
        selectedHitCollections,
      ),
  });

  if (isLoading) {
    return <CenteredProgress />;
  }

  return (
    <Chart
      chartType="Sankey"
      width="100%"
      height="100%"
      style={{ overflow: "auto" }}
      rows={graphData ?? []}
      columns={[
        { label: "From", type: "string" },
        { label: "To", type: "string" },
        { label: "Weight", type: "number" },
      ]}
      options={chartOptions}
    />
  );
};
