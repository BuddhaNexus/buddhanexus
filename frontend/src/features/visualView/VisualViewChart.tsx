import React from "react";
import { Chart } from "react-google-charts";
import {
  useVisualCollectionStringParam,
  useVisualHitCollectionsStringParam,
} from "@components/hooks/params";
import mockGraphData from "@features/visualView/mockGraphData.json";
import { Paper, Typography } from "@mui/material";

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

export function VisualViewChart() {
  const [selectedCollection, setSelectedCollection] =
    useVisualCollectionStringParam();
  const [selectedHitCollections, setSelectedHitCollections] =
    useVisualHitCollectionsStringParam();

  console.log({ selectedCollection, selectedHitCollections });

  const isViewEnabled =
    selectedCollection && Boolean(selectedHitCollections?.length);

  return (
    <Paper sx={{ flex: isViewEnabled ? 1 : undefined, m: 2, p: 2 }}>
      {isViewEnabled ? (
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
      ) : (
        <>
          <Typography variant="h1">Visual View</Typography>
          <Typography sx={{ m: 2 }}>
            Select the Inquiry and Hit Collections.
          </Typography>
          <Typography sx={{ m: 2 }}>
            More than one Hit Collection can be selected. To reduce the view to
            a single subsection, click on the coloured bar in the Inquiry
            Collection (left).
          </Typography>

          <Typography sx={{ m: 2 }}>
            The view can be further reduced to a single text. A click on a
            single text will open the text view where the individual matches
            will be displayed.
          </Typography>
        </>
      )}
    </Paper>
  );
}
