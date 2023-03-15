import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { atom, useSetAtom } from "jotai";

export const VIEWS = ["graph", "numbers", "table", "text"] as const;
export type DbView = (typeof VIEWS)[number];

export const currentDbViewAtom = atom<DbView>("table");

interface Props {
  currentView: DbView;
}

export const DbViewSelector = ({ currentView }: Props) => {
  const { t } = useTranslation();

  const { asPath, push } = useRouter();
  const setCurrentDbView = useSetAtom(currentDbViewAtom);

  const handleChange = (e: React.ChangeEvent<{ value: DbView }>) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    push(asPath.replace(currentView, e.target.value));
    setCurrentDbView(e.target.value);
  };

  return (
    <FormControl variant="filled" sx={{ width: 1, mb: 2 }}>
      <InputLabel id="db-view-selector-label">
        {t(`common:dbViewSelector.view`)}
      </InputLabel>
      <Select
        labelId="db-view-selector-label"
        id="db-view-selector"
        value={currentView}
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
