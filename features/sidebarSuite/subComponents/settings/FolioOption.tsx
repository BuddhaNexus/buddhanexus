import { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
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
import { StringParam, useQueryParam } from "use-query-params";
import { DbApi } from "utils/api/dbApi";
import type { DatabaseFolio } from "utils/api/utils";

// TODO: add handling for functionality change for different views (jump to / only show)
export default function FolioOption() {
  const { t } = useTranslation("settings");
  const { fileName, defaultParamConfig, uniqueSettings } = useDbQueryParams();
  const { data, isLoading } = useQuery({
    queryKey: DbApi.FolioData.makeQueryKey(fileName),
    queryFn: () => DbApi.FolioData.call(fileName),
  });

  const [folioParam, setFolioParam] = useQueryParam(
    uniqueSettings.queryParams.folio,
    StringParam
  );

  useEffect(() => {
    setFolioParam(folioParam ?? defaultParamConfig.folio);
  }, [folioParam, setFolioParam, defaultParamConfig]);

  const showAll = t("optionsLabels.folioShowAll");

  const handleSelectChange = (value: string) => {
    setFolioParam(value === showAll ? null : value);
  };

  return (
    <Box sx={{ width: 1, my: 2 }}>
      <FormControl sx={{ width: 1 }} title={t("optionsLabels.folioAsLimit")}>
        <InputLabel id="folio-option-selector-label">
          {t("optionsLabels.folioAsLimit")}
        </InputLabel>
        {isLoading ? (
          <Select
            labelId="folio-option-selector-label"
            id="folio-option-selector"
            displayEmpty={true}
            value={showAll}
            input={<OutlinedInput label={t("optionsLabels.folioAsLimit")} />}
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
            id="folio-option-selector"
            displayEmpty={true}
            input={<OutlinedInput label={t("optionsLabels.folioAsLimit")} />}
            value={folioParam ?? showAll}
            onChange={(e) => handleSelectChange(e.target.value)}
          >
            <MenuItem value={showAll}>
              <em>{showAll}</em>
            </MenuItem>
            {data &&
              data.length > 1 &&
              data.map((folio: DatabaseFolio) => {
                return (
                  <MenuItem key={folio.id} value={folio.id}>
                    {folio.segmentNr}
                  </MenuItem>
                );
              })}
          </Select>
        )}
      </FormControl>
    </Box>
  );
}
