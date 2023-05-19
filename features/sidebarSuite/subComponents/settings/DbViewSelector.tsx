import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { currentViewAtom, DbViewEnum } from "@components/hooks/useDbView";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useAtom } from "jotai";

export const DbViewSelector = () => {
  const { t } = useTranslation("settings");

  const { asPath, push } = useRouter();
  const [currentView, setCurrentDbView] = useAtom(currentViewAtom);

  const handleChange = async (e: SelectChangeEvent) => {
    await push(asPath.replace(currentView, e.target.value));
    setCurrentDbView(e.target.value as DbViewEnum);
  };

  return (
    <FormControl variant="filled" sx={{ width: 1, mb: 2 }}>
      <InputLabel id="db-view-selector-label">
        {t(`dbViewLabels.view`)}
      </InputLabel>
      <Select
        labelId="db-view-selector-label"
        id="db-view-selector"
        value={currentView}
        onChange={(e: SelectChangeEvent) => handleChange(e)}
      >
        {Object.values(DbViewEnum).map((view) => (
          <MenuItem key={view} value={view}>
            {t(`dbViewLabels.${view}`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
