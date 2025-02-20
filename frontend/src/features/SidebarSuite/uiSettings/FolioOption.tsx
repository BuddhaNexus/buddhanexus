import { useTranslation } from "next-i18next";
import { useFolioParam } from "@components/hooks/params";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";

function SelectorFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Box sx={{ width: 1, my: 2 }}>
      <FormControl sx={{ width: 1 }} title={label}>
        <InputLabel id="folio-option-selector-label">{label}</InputLabel>
        {children}
      </FormControl>
    </Box>
  );
}

function Loading({ showAll, label }: { showAll: string; label: string }) {
  return (
    <Select
      labelId="folio-option-selector-label"
      value={showAll}
      inputProps={{
        id: "folio-option-selector",
      }}
      input={<OutlinedInput label={label} />}
      displayEmpty
    >
      <MenuItem value={showAll}>
        <em>{showAll}</em>
      </MenuItem>
      <MenuItem value="loading">
        <CircularProgress color="inherit" size={20} />
      </MenuItem>
    </Select>
  );
}

// TODO: add handling for functionality change for different views (jump to / only show)
export default function FolioOption() {
  const { t } = useTranslation("settings");
  const { fileName } = useDbPageRouterParams();

  const { data, isLoading } = useQuery({
    queryKey: DbApi.FolioData.makeQueryKey(fileName),
    queryFn: () => DbApi.FolioData.call({ filename: fileName }),
  });

  const [folioParam, setFolioParam] = useFolioParam();

  const showAll = t("optionsLabels.folioShowAll");

  const handleSelectChange = async (event: SelectChangeEvent) => {
    const { value } = event.target;
    await setFolioParam(value === showAll ? null : value);
  };

  const label = t("optionsLabels.folioAsLimit");

  if (isLoading) {
    return (
      <SelectorFrame label={label}>
        <Loading showAll={showAll} label={label} />
      </SelectorFrame>
    );
  }

  return (
    <SelectorFrame label={label}>
      <Select
        labelId="folio-option-selector-label"
        inputProps={{
          id: "folio-option-selector",
        }}
        input={<OutlinedInput label={label} />}
        value={folioParam ?? showAll}
        displayEmpty
        onChange={handleSelectChange}
      >
        <MenuItem value={showAll}>
          <em>{showAll}</em>
        </MenuItem>
        {data?.map((folio) => {
          return (
            <MenuItem key={folio} value={folio}>
              {folio}
            </MenuItem>
          );
        })}
      </Select>
    </SelectorFrame>
  );
}
