import { useSearchParams } from "next/navigation";
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

  const router = useRouter();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);
  const [currentView, setCurrentDbView] = useAtom(currentViewAtom);

  const handleChange = async (e: SelectChangeEvent) => {
    const newView = e.target.value as DbViewEnum;

    await router.push({
      pathname: router.pathname.replace(currentView, newView),
      query: params.toString(),
    });
    setCurrentDbView(newView);
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
