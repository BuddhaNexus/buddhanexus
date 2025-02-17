import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import {
  useVisualCollectionStringParam,
  useVisualHitCollectionsStringParam,
} from "@components/hooks/params";
import { VisualViewChart } from "@features/visualView/VisualViewChart";
import { Paper, Typography } from "@mui/material";

function VisualViewInfo() {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h1">{t("visual.visualInfoHeader")}</Typography>
      <Typography sx={{ m: 2 }}>{t("visual.visualInfo1")}</Typography>
      <Typography sx={{ m: 2 }}>{t("visual.visualInfo2")}</Typography>
    </>
  );
}

export function VisualViewChartContainer() {
  const [selectedCollection] = useVisualCollectionStringParam();
  const [selectedHitCollections] = useVisualHitCollectionsStringParam();

  const [currentPage] = useState(0);

  const isViewEnabled =
    selectedCollection && Boolean(selectedHitCollections?.length);

  return (
    <Paper sx={{ height: "auto", m: 2, p: 2 }}>
      {isViewEnabled ? (
        <VisualViewChart currentPage={currentPage} />
      ) : (
        <VisualViewInfo />
      )}
    </Paper>
  );
}
