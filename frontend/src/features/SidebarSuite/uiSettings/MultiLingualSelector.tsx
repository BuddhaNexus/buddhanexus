// import * as React from "react";
// import { useRouter } from "next/router";
// import { useTranslation } from "next-i18next";
// import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
// import {
//   Popper,
//   PopperMsgBox,
// } from "@features/sidebarSuite/common/MuiStyledSidebarComponents";
// import {
//   Box,
//   Fade,
//   FormControl,
//   FormLabel,
//   ListItemText,
//   MenuItem,
// } from "@mui/material";
// import Checkbox from "@mui/material/Checkbox";
// import Select from "@mui/material/Select";
// import type { Theme } from "@mui/material/styles";
// import { useTheme } from "@mui/material/styles";
// import { useQuery } from "@tanstack/react-query";
// import { DbApi } from "@utils/api/dbApi";
// import { DbLanguage } from "@utils/api/types";
// import { allUIComponentParamNames } from "@features/sidebarSuite/uiSettingsDefinition";

// function getStyles(
//   name: DbLanguage,
//   selectedLanguages: DbLanguage[] | undefined,
//   theme: Theme
// ) {
//   if (!selectedLanguages) return;
//   return {
//     fontWeight: selectedLanguages.includes(name)
//       ? theme.typography.fontWeightMedium
//       : theme.typography.fontWeightRegular,
//   };
// }

// const MultiLingualSelector = () => {
//   const { t } = useTranslation(["settings", "common"]);
//   const router = useRouter();
//   const { fileName } = useDbPageRouterParams();
//   const theme = useTheme();

//   const queryParams = {
//     multi_lingual: null,
//   };

//   const { data: availableLanguages } = useQuery({
//     queryKey: DbApi.AvailableLanguagesData.makeQueryKey(fileName),
//     queryFn: () => DbApi.AvailableLanguagesData.call({ filename: fileName }),
//   });

//   const [paramValue, setParamValue] = React.useState([
//     ...(availableLanguages ?? []),
//   ]);

//   React.useEffect(() => {
//     // Reset button press
//     if (queryParams.multi_lingual === undefined) {
//       setParamValue([...(availableLanguages ?? [])]);
//     }
//   }, [availableLanguages, queryParams.multi_lingual]);

//   const handleChange = async (event: any) => {
//     // TODO: confirm desired handling.
//     const {
//       target: { value },
//     } = event;
//     setParamValue(value);

//     if (value.length === 0) {
//       return;
//     }

//     await router.push({
//       pathname: router.pathname,
//       query: {
//         ...router.query,
//         // A string is given here to avoid NextJS setting params with repeated keys. This allows default value comparison in CurrentResultChips.
//         [allUIComponentParamNames.languages]: value.toString(),
//       },
//     });
//   };

//   const anchorRef = React.useRef();
//   const selectorLabel = t("optionsLabels.multiLingual");
//   const getRenderValue = (selected: DbLanguage[]) => {
//     return selected.length > 0 ? (
//       selected.map((selection) => t(`common:language.${selection}`)).join(", ")
//     ) : (
//       <em style={{ color: theme.palette.text.secondary }}>
//         {t("generic.noSelection")}
//       </em>
//     );
//   };

//   return (
//     <Box ref={anchorRef} sx={{ width: 1, mt: 1, mb: 2 }}>
//       <FormControl sx={{ width: 1 }} error={paramValue.length === 0}>
//         <FormLabel sx={{ mb: 1 }} id="multi-lingual-selector-label">
//           {selectorLabel}
//         </FormLabel>
//         {/* <InputLabel id="multi-lingual-selector-label" shrink>

//         </InputLabel> */}

//         <Select
//           labelId="multi-lingual-selector-label"
//           // label={selectorLabel}
//           aria-describedby="multi-lingual-selector-helper-text"
//           value={paramValue}
//           inputProps={{
//             id: "multi-lingual-selector",
//           }}
//           // input={<OutlinedInput label={selectorLabel} notched />}
//           renderValue={getRenderValue}
//           multiple
//           displayEmpty
//           onChange={handleChange}
//         >
//           {availableLanguages?.map((langKey: DbLanguage) => (
//             <MenuItem
//               key={langKey}
//               value={langKey}
//               style={getStyles(langKey, availableLanguages, theme)}
//             >
//               <Checkbox checked={paramValue?.includes(langKey)} />
//               <ListItemText primary={t(`common:language.${langKey}`)} />
//             </MenuItem>
//           ))}
//         </Select>

//         <Popper
//           id="multi-lingual-selector-helper-text"
//           open={paramValue.length === 0}
//           anchorEl={anchorRef.current}
//           placement="top"
//           sx={{ maxWidth: 320 }}
//           modifiers={[
//             {
//               name: "offset",
//               options: {
//                 offset: [0, 20],
//               },
//             },
//           ]}
//           transition
//         >
//           {({ TransitionProps }) => (
//             <Fade {...TransitionProps} timeout={200}>
//               <PopperMsgBox>
//                 {t("optionsLabels.multiLingualError")}
//               </PopperMsgBox>
//             </Fade>
//           )}
//         </Popper>
//       </FormControl>
//     </Box>
//   );
// };

// export default MultiLingualSelector;

export default function MultiLingualSelector() {
  return null;
}
