import { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import type { ParsedFolio } from "@utils/api/endpoints/utils/folios";
import { StringParam, useQueryParam } from "use-query-params";
import { allUIComponentParamNames } from "@features/sidebarSuite/uiSettingsDefinition";

// TODO: add handling for functionality change for different views (jump to / only show)
export default function FolioOption() {
  const { t } = useTranslation("settings");
  const { fileName } = useDbRouterParams();

  const defaultParamConfig = {
    folio: null,
  };
  const { data, isLoading } = useQuery({
    queryKey: DbApi.FolioData.makeQueryKey(fileName),
    queryFn: () => DbApi.FolioData.call({ filename: fileName }),
  });

  const [folioParam, setFolioParam] = useQueryParam(
    allUIComponentParamNames.folio,
    StringParam
  );

  useEffect(() => {
    setFolioParam(folioParam ?? defaultParamConfig.folio);
  }, [folioParam, setFolioParam, defaultParamConfig]);

  const showAll = t("optionsLabels.folioShowAll");

  const handleSelectChange = (value: string) => {
    setFolioParam(value === showAll ? null : value);
  };

  const selectorLabel = t("optionsLabels.folioAsLimit");

  return (
    <Box sx={{ width: 1, my: 2 }}>
      <FormControl sx={{ width: 1 }} title={selectorLabel}>
        <InputLabel id="folio-option-selector-label">
          {selectorLabel}
        </InputLabel>
        {isLoading ? (
          <Select
            labelId="folio-option-selector-label"
            value={showAll}
            inputProps={{
              id: "folio-option-selector",
            }}
            input={<OutlinedInput label={selectorLabel} />}
            displayEmpty
          >
            <MenuItem value={showAll}>
              <em>{showAll}</em>
            </MenuItem>
            <MenuItem value="loading">
              <CircularProgress color="inherit" size={20} />
            </MenuItem>
          </Select>
        ) : (
          <Select
            labelId="folio-option-selector-label"
            inputProps={{
              id: "folio-option-selector",
            }}
            input={<OutlinedInput label={selectorLabel} />}
            value={folioParam ?? showAll}
            displayEmpty
            onChange={(e) => handleSelectChange(e.target.value)}
          >
            <MenuItem value={showAll}>
              <em>{showAll}</em>
            </MenuItem>
            {data &&
              data.length > 1 &&
              data.map((folio: ParsedFolio) => {
                return (
                  <MenuItem key={folio.segmentNr} value={folio.number}>
                    {folio.number}
                  </MenuItem>
                );
              })}
          </Select>
        )}
      </FormControl>
    </Box>
  );
}
