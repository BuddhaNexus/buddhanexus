import * as React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import {
  Box,
  Fade,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import type { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import {
  Popper,
  PopperMsgBox,
} from "features/sidebarSuite/common/MuiStyledSidebarComponents";
import { DbApi } from "utils/api/dbApi";
import type { SourceLanguage } from "utils/constants";

function getStyles(
  name: SourceLanguage,
  selectedLanguages: SourceLanguage[] | undefined,
  theme: Theme,
) {
  if (!selectedLanguages) return;
  return {
    fontWeight: selectedLanguages.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const SourceLanguagesSelector = () => {
  const { t } = useTranslation(["settings", "common"]);
  const router = useRouter();
  const { fileName, queryParams, uniqueSettings } = useDbQueryParams();
  const theme = useTheme();

  const { data: availableLanguages } = useQuery({
    queryKey: DbApi.AvailableLanguagesData.makeQueryKey(fileName),
    queryFn: () => DbApi.AvailableLanguagesData.call(fileName),
  });
  const availableLanguagesString = availableLanguages?.join(",");

  const [paramValue, setParamValue] = React.useState([
    ...(availableLanguages ?? []),
  ]);

  React.useEffect(() => {
    // Reset button press
    if (queryParams.multi_lingual === undefined) {
      setParamValue([...(availableLanguages ?? [])]);
    }
  }, [availableLanguages, queryParams.multi_lingual]);

  const handleChange = async (event: any) => {
    // TODO: confirm desired handling.
    const {
      target: { value },
    } = event;
    setParamValue(value);
    const valueString = value.join(",");

    if (valueString === availableLanguagesString) {
      return;
    }

    await router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        ...(valueString !== "" && {
          [uniqueSettings.remote.availableLanguages]: valueString,
        }),
      },
    });
  };

  const anchorRef = React.useRef();
  const selectorLabel = t("optionsLabels.multiLingual");

  return (
    <Box ref={anchorRef} sx={{ width: 1, my: 2 }}>
      <FormControl sx={{ width: 1 }} error={paramValue.length === 0}>
        <InputLabel id="multi-lingual-selector-label" shrink>
          {selectorLabel}
        </InputLabel>

        <Select
          labelId="multi-lingual-selector-label"
          id="multi-lingual-selector"
          label={selectorLabel}
          aria-describedby="multi-lingual-selector-helper-text"
          value={paramValue}
          input={<OutlinedInput label={selectorLabel} notched />}
          renderValue={(selected) =>
            selected.length > 0 ? (
              selected
                .map((selection) =>
                  t(
                    `common:language.${selection as unknown as SourceLanguage}`,
                  ),
                )
                .join(", ")
            ) : (
              <em style={{ color: theme.palette.text.secondary }}>
                {t("generic.noSelection")}
              </em>
            )
          }
          multiple
          displayEmpty
          onChange={handleChange}
        >
          {availableLanguages?.map((langKey: SourceLanguage) => (
            <MenuItem
              key={langKey}
              value={langKey}
              style={getStyles(langKey, availableLanguages, theme)}
            >
              <Checkbox checked={paramValue?.includes(langKey)} />
              <ListItemText primary={t(`common:language.${langKey}`)} />
            </MenuItem>
          ))}
        </Select>

        <Popper
          id="multi-lingual-selector-helper-text"
          open={paramValue.length === 0}
          anchorEl={anchorRef.current}
          placement="top"
          sx={{ maxWidth: 320 }}
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 70],
              },
            },
          ]}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <PopperMsgBox>
                {t("optionsLabels.multiLingualError")}
              </PopperMsgBox>
            </Fade>
          )}
        </Popper>
      </FormControl>
    </Box>
  );
};

export default SourceLanguagesSelector;
