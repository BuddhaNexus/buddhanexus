import { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import {
  CircularProgress,
  FormControl,
  FormLabel,
  MenuItem,
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
    <Box sx={{ width: 1, m: 2 }}>
      <FormLabel id="folio-option-selector-label">
        {t("optionsLabels.folioAsLimit")}
      </FormLabel>
      <FormControl sx={{ width: 1 }}>
        {isLoading ? (
          <Select
            id="folio-option-selector"
            aria-labelledby="folio-option-selector-label"
            displayEmpty={true}
            value={showAll}
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
            id="folio-option-selector"
            aria-labelledby="folio-option-selector-label"
            displayEmpty={true}
            value={folioParam ?? showAll}
            onChange={(e) => handleSelectChange(e.target.value)}
          >
            <MenuItem value={showAll}>
              <em>{showAll}</em>
            </MenuItem>
            {data &&
              data.length > 1 &&
              data.map((folio: DatabaseFolio) => {
                // TODO: confirm that 0 should always be skipped (as with pli)
                if (folio.id === "0") {
                  return null;
                }

                return (
                  <MenuItem key={folio.id} value={folio.id}>
                    {folio.id}
                  </MenuItem>
                );
              })}
          </Select>
        )}
      </FormControl>
    </Box>
  );
}
