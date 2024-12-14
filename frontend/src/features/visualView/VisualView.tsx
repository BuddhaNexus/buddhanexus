import React from "react";
import { Chart } from "react-google-charts";
import { Typography } from "@mui/material";

import mockGraphData from "./mockGraphData.json";

// let { graphdata, error } = await getDataForVisual({
//   searchTerm: searchTerm,
//   selected: this.selectedCollections,
//   language: this.language,
// });

const graphColors = [
  "rgb(23, 190, 207)",
  "rgb(31, 119, 180)",
  "rgb(255,127,14)",
  "rgb(44, 160, 44)",
  "rgb(214, 39, 40)",
  "rgb(148, 103, 189)",
  "rgb(140, 86, 75)",
  "rgb(227, 119, 194)",
  "rgb(127, 127, 127)",
  "rgb(188,189,34)",
  "rgb(23, 190, 207)",
  "rgb(44, 160, 44)",
  "rgb(255,127,14)",
  "rgb(44, 160, 44)",
  "rgb(214, 39, 40)",
  "rgb(148, 103, 189)",
  "rgb(140, 86, 75)",
  "rgb(255,127,14)",
  "rgb(31, 119, 180)",
  "rgb(188,189,34)",
  "rgb(23, 190, 207)",
  "rgb(148, 103, 189)",
  "rgb(227, 119, 194)",
  "rgb(140, 86, 75)",
  "rgb(214, 39, 40)",
  "rgb(227, 119, 194)",
  "rgb(44, 160, 44)",
  "rgb(127, 127, 127)",
  "rgb(23, 190, 207)",
];

export const VisualView = () => {
  return (
    <Chart
      chartType="Sankey"
      width="100%"
      height="100%"
      rows={mockGraphData}
      columns={[
        { label: "From", type: "string" },
        { label: "To", type: "string" },
        { label: "Weight", type: "number" },
      ]}
      options={{
        sankey: {
          iterations: 0,
          node: {
            width: 40,
            interactivity: true,
            nodePadding: 20,
            colors: graphColors,
            label: {
              fontSize: 14,
              bold: true,
            },
          },
          link: {
            colorMode: "gradient",
            fillOpacity: 0.4,
            colors: graphColors,
          },
        },
      }}
    />
  );
};
