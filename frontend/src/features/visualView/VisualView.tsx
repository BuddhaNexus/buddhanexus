import React from "react";
import { useVisualCollectionStringParam } from "@components/hooks/params";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { VisualViewChart } from "@features/visualView/VisualViewChart";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  NativeSelect,
  Paper,
  Select,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";

// let { graphdata, error } = await getDataForVisual({
//   searchTerm: searchTerm,
//   selected: this.selectedCollections,
//   language: this.language,
// });

// Select the Inquiry and Hit Collections. More than one Hit Collection can be selected. To reduce the view to a single subsection, click on the pertinent coloured bar in the Inquiry Collection (left). The view can be further reduced to a single text. A click on a single text will open the text view where the individual matches will be displayed.

function VisualViewHeader() {
  const { dbLanguageName, dbLanguage } = useDbRouterParams();

  const [selectedCollection, setSelectedCollection] =
    useVisualCollectionStringParam();

  const inquiryCollectionLabel = "Inquiry Collection";

  const { data, isLoading } = useQuery({
    queryKey: DbApi.VisualViewCollections.makeQueryKey(dbLanguage),
    queryFn: () => DbApi.VisualViewCollections.call(dbLanguage),
  });

  return (
    <Paper sx={{ mx: 2, py: 1, px: 2 }}>
      <FormControl>
        <Box>
          <InputLabel id="collection-option-selector-label">
            {inquiryCollectionLabel}
          </InputLabel>
          <Select
            variant="outlined"
            sx={{ minWidth: 200 }}
            id="collection-option-selector"
            labelId="collection-option-selector-label"
            label={inquiryCollectionLabel}
            value={data ? selectedCollection : ""}
            onChange={(e) => setSelectedCollection(e.target.value)}
          >
            {isLoading ? (
              <CenteredProgress />
            ) : (
              data?.map(({ key, name, language }) => (
                <MenuItem key={key} value={name}>
                  {name}
                </MenuItem>
              ))
            )}
          </Select>
        </Box>
      </FormControl>
    </Paper>
  );
}

export const VisualView = () => {
  // const [selectedCollection, setSelectedCollection] =
  //   useVisualCollectionStringParam();

  return (
    <>
      <VisualViewHeader />
      <VisualViewChart />
    </>
  );
};
