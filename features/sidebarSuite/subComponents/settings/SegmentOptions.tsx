import React from "react";
import { useTranslation } from "next-i18next";
import {
  shouldShowSegmentNumbersAtom,
  shouldUseOldSegmentColorsAtom,
} from "@components/hooks/useDbView";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { useAtom } from "jotai/index";

export const SegmentOptions = () => {
  const { t } = useTranslation("settings");

  const [shouldShowSegmentNumbers, setShouldShowSegmentNumbers] = useAtom(
    shouldShowSegmentNumbersAtom,
  );
  const [shouldUseOldSegmentColors, setShouldUseOldSegmentColors] = useAtom(
    shouldUseOldSegmentColorsAtom,
  );

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
            checked={shouldUseOldSegmentColors}
            onChange={(event) =>
              setShouldUseOldSegmentColors(event.target.checked)
            }
          />
        }
        label={t("optionsLabels.usePreviousSegmentColors")}
      />
    </FormGroup>
  );
};
