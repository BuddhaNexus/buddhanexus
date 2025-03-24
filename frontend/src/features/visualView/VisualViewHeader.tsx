import React from "react";
import { useTranslation } from "next-i18next";
import {
  useVisualCollectionStringParam,
  useVisualHitCollectionsStringParam,
} from "@components/hooks/params";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { ParsedApiV1VisualCollection } from "@utils/api/endpoints/visual-view";

export function VisualViewHeader() {
  const { dbLanguage } = useDbPageRouterParams();
  const { t } = useTranslation();

  const [selectedCollection, setSelectedCollection] =
    useVisualCollectionStringParam();
  const [selectedHitCollections, setSelectedHitCollections] =
    useVisualHitCollectionsStringParam();

  const { data, isLoading } = useQuery({
    queryKey: DbApi.VisualViewCollections.makeQueryKey(dbLanguage),
    queryFn: () => DbApi.VisualViewCollections.call(dbLanguage),
  });

  const hitCollectionsValue = React.useMemo(
    () => data?.filter((v) => selectedHitCollections?.includes(v.key)),
    [data, selectedHitCollections],
  );

  return (
    <Paper
      sx={{
        mx: 2,
        mt: { xs: 2, sm: 0 },
        p: 1,
        flexDirection: { xs: "column", md: "row" },
        display: "flex",
      }}
    >
      <FormControl sx={{ m: 1, display: "flex", flexDirection: "row" }}>
        <InputLabel id="collection-option-selector-label">
          {t("visual.inquiryCollectionLabel")}
        </InputLabel>
        <Select
          variant="outlined"
          sx={{ minWidth: 200 }}
          id="collection-option-selector"
          labelId="collection-option-selector-label"
          displayEmpty={true}
          label={t("visual.inquiryCollectionLabel")}
          value={data ? selectedCollection : ""}
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          {data?.map(({ key, name }) => (
            <MenuItem key={key} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Hit collection*/}
      {selectedCollection ? (
        <FormControl sx={{ m: 1 }}>
          <Autocomplete<ParsedApiV1VisualCollection>
            id="hit-collections-option-selector"
            options={data ?? []}
            isOptionEqualToValue={(option, value) => option.key === value.key}
            getOptionLabel={(option) => option.name}
            sx={{ minWidth: 200, maxWidth: 500 }}
            // @ts-expect-error not sure what's up here, this is fine
            multiple={true}
            loading={isLoading}
            filterSelectedOptions={true}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={t("visual.hitCollectionsLabel")}
              />
            )}
            // @ts-expect-error not sure what's up here, this is fine
            value={hitCollectionsValue ?? []}
            onChange={(e, newValue) =>
              // @ts-expect-error not sure what's up here, this is fine
              setSelectedHitCollections(newValue?.map((i) => i.key))
            }
          />
        </FormControl>
      ) : null}
    </Paper>
  );
}
