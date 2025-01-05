import React from "react";
import {
  useVisualCollectionStringParam,
  useVisualHitCollectionsStringParam,
} from "@components/hooks/params";
import { VisualViewChart } from "@features/visualView/VisualViewChart";
import { Paper, Typography } from "@mui/material";

function VisualViewInfo() {
  return (
    <>
      <Typography variant="h1">Visual View</Typography>
      <Typography sx={{ m: 2 }}>
        Select the Inquiry and Hit Collections.
      </Typography>
      <Typography sx={{ m: 2 }}>
        More than one Hit Collection can be selected. To reduce the view to a
        single subsection, click on the coloured bar in the Inquiry Collection
        (left).
      </Typography>

      <Typography sx={{ m: 2 }}>
        The view can be further reduced to a single text. A click on a single
        text will open the text view where the individual matches will be
        displayed.
      </Typography>
    </>
  );
}

export function VisualViewChartContainer() {
  const [selectedCollection] = useVisualCollectionStringParam();
  const [selectedHitCollections] = useVisualHitCollectionsStringParam();

  const isViewEnabled =
    selectedCollection && Boolean(selectedHitCollections?.length);

  return (
    <Paper sx={{ flex: isViewEnabled ? 1 : undefined, m: 2, p: 2 }}>
      {isViewEnabled ? <VisualViewChart /> : <VisualViewInfo />}
    </Paper>
  );
}
