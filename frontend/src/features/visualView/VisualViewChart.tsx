import React, { useMemo } from "react";
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

export const VisualViewChart = ({ currentPage }: { currentPage: number }) => {
  const { dbLanguage } = useDbRouterParams();
  const [selectedCollection] = useVisualCollectionStringParam();
  const [selectedHitCollections] = useVisualHitCollectionsStringParam();

  const { data, isLoading } = useQuery({
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

  const chartHeight = useMemo(() => {
    const pageData = data?.filteredData?.[currentPage];
    if (!pageData) {
      return "100%";
    }

    const weights: number[] = pageData.map(
      (value: [string, string, number]) => value[2],
    );
    const maxWeight = Math.max(...weights);
    const meanScaledWeight =
      weights.reduce((acc: number, weight) => {
        // map to a [0, 1] scale
        return acc + weight / maxWeight;
      }, 0) / pageData.length;

    const magicHeightNumber = pageData.length * meanScaledWeight * 5;

    return `${magicHeightNumber < 80 ? 80 : magicHeightNumber}vh`;
  }, [currentPage, data?.filteredData]);

  if (isLoading) {
    return <CenteredProgress />;
  }

  return (
    <Chart
      chartType="Sankey"
      width="100%"
      height="100%"
      rows={data?.filteredData[currentPage] ?? []}
      style={{ height: chartHeight }}
      columns={[
        { label: "From", type: "string" },
        { label: "To", type: "string" },
        { label: "Weight", type: "number" },
      ]}
      options={{
        sankey: {
          iterations: 0,
          node: {
            width: 50,
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
      }}
    />
  );
};
