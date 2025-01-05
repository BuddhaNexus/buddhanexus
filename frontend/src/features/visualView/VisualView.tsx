import React from "react";
import { VisualViewChartContainer } from "@features/visualView/VisualViewChartContainer";
import { VisualViewHeader } from "@features/visualView/VisualViewHeader";

// let { graphdata, error } = await getDataForVisual({
//   searchTerm: searchTerm,
//   selected: this.selectedCollections,
//   language: this.language,
// });

// Select the Inquiry and Hit Collections. More than one Hit Collection can be selected. To reduce the view to a single subsection, click on the pertinent coloured bar in the Inquiry Collection (left). The view can be further reduced to a single text. A click on a single text will open the text view where the individual matches will be displayed.

// todo: call https://buddhanexus.kc-tbts.uni-hamburg.de/api/visual/Suttas-Early-2?language=pli&selected=pli_Suttas-Early-1
// todo: pass data to chart

// todo: add color scheme selector

export const VisualView = () => {
  return (
    <>
      <VisualViewHeader />
      <VisualViewChartContainer />
    </>
  );
};
