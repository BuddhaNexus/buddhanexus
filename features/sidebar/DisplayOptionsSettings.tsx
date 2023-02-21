import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@components/db/DbViewSelector";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Divider, List, ListItem, Typography } from "@mui/material";
import {
  FolioOption,
  SortOption,
  TextScriptOption,
} from "features/sidebar/settingComponents";
import { StandinFilter } from "features/sidebar/Sidebar";
import { useAtomValue } from "jotai";
import { DISPLAY_OPTIONS, type DisplayOption } from "utils/dbUISettings";

const displayOptionComponents: [DisplayOption, React.ElementType][] = [
  ["folio", FolioOption],
  ["multi_lingual", () => StandinFilter("showAndPositionSegmentNrs")],
  ["script", TextScriptOption],
  [
    "showAndPositionSegmentNrs",
    () => StandinFilter("showAndPositionSegmentNrs"),
  ],
  ["sort_method", SortOption],
];

export const DisplayOptionsSettings = () => {
  const currentDbView = useAtomValue(currentDbViewAtom);
  const { sourceLanguage } = useDbQueryParams();
  const { t } = useTranslation();

  let listLength = 0;

  const OptionsList = () => (
    <List>
      {displayOptionComponents.map((option) => {
        const [name, DisplayOptionComponent] = option;
        if (!DISPLAY_OPTIONS[name].views.includes(currentDbView)) {
          return null;
        }
        if (!DISPLAY_OPTIONS[name].langs.includes(sourceLanguage)) {
          return null;
        }

        listLength += 1;

        return (
          <ListItem key={name}>
            <DisplayOptionComponent />
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <>
      {listLength > 0 ? (
        <>
          <Typography variant="h6" mx={2}>
            {t("settings:headings.display")}
          </Typography>
          <OptionsList />
          <Divider sx={{ my: 2 }} />
        </>
      ) : null}
    </>
  );
};
