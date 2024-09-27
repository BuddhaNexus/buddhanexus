import React from "react";
import { useTranslation } from "next-i18next";
import {
  shouldShowSegmentNumbersAtom,
  shouldUseMonochromaticSegmentColorsAtom,
} from "@features/atoms";
import { FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";
import { useAtom } from "jotai/index";

export const SegmentOptions = () => {
  const { t } = useTranslation("settings");

  const [shouldShowSegmentNumbers, setShouldShowSegmentNumbers] = useAtom(
    shouldShowSegmentNumbersAtom,
  );
  const [shouldUseMonochromaticSegmentColors, setShouldUseOldSegmentColors] =
    useAtom(shouldUseMonochromaticSegmentColorsAtom);

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={shouldShowSegmentNumbers}
            onChange={(event) =>
              setShouldShowSegmentNumbers(event.target.checked)
            }
          />
        }
        label={t("optionsLabels.showSegmentNumbers")}
      />
      <FormControlLabel
        control={
          <Switch
            checked={shouldUseMonochromaticSegmentColors}
            onChange={(event) =>
              setShouldUseOldSegmentColors(event.target.checked)
            }
          />
        }
        label={
          <Typography lineHeight={1.25}>
            {t("optionsLabels.useMonochromaticSegmentColors")}
          </Typography>
        }
      />
    </FormGroup>
  );
};
