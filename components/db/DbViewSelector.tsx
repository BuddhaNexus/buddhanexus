import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { atom, useAtom } from "jotai";

export const VIEWS = ["graph", "numbers", "table", "text"] as const;
export type DbView = (typeof VIEWS)[number];

export const currentDbViewAtom = atom<DbView>("table");

export const DbViewSelector = () => {
  const { t } = useTranslation();

  const { asPath, push } = useRouter();
  const [currentDbView, setCurrentDbView] = useAtom(currentDbViewAtom);

  const handleChange = (event: React.ChangeEvent<{ value: DbView }>) => {
    setCurrentDbView(event.target.value);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    push(asPath.replace(currentDbView, event.target.value));
  };

  return (
    <FormControl variant="filled">
      <InputLabel id="db-view-selector-label">View</InputLabel>
      <Select
        labelId="db-view-selector-label"
        id="db-view-selector"
        value={currentDbView}
        onChange={(e) =>
          handleChange(e as React.ChangeEvent<{ value: DbView }>)
        }
      >
        {VIEWS.map((view) => (
          <MenuItem key={view} value={view}>
            {t(`common:dbViewSelector.${view}`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
