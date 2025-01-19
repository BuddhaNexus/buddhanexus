import React from "react";
import { VisualViewChartContainer } from "@features/visualView/VisualViewChartContainer";
import { VisualViewHeader } from "@features/visualView/VisualViewHeader";

// todo: add color scheme selector
// todo: add pagination
// todo: redirect to text view on click

export const VisualView = () => {
  return (
    <>
      <VisualViewHeader />
      <VisualViewChartContainer />
    </>
  );
};
