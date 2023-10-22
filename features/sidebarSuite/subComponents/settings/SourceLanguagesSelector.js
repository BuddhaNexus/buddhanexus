"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var next_i18next_1 = require("next-i18next");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var material_1 = require("@mui/material");
var Checkbox_1 = require("@mui/material/Checkbox");
var OutlinedInput_1 = require("@mui/material/OutlinedInput");
var Select_1 = require("@mui/material/Select");
var styles_1 = require("@mui/material/styles");
var react_query_1 = require("@tanstack/react-query");
var MuiStyledSidebarComponents_1 = require("features/sidebarSuite/common/MuiStyledSidebarComponents");
var use_query_params_1 = require("use-query-params");
var dbApi_1 = require("utils/api/dbApi");
var ITEM_HEIGHT = 48;
var ITEM_PADDING_TOP = 8;
var MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: MuiStyledSidebarComponents_1.SETTINGS_DRAWER_WIDTH - 60,
        },
    },
};
function getStyles(name, selectedLanguages, theme) {
    if (!selectedLanguages)
        return;
    return {
        fontWeight: selectedLanguages.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}
var SourceLanguagesSelector = function () {
    var t = (0, next_i18next_1.useTranslation)("settings").t;
    var _a = (0, useDbQueryParams_1.useDbQueryParams)(), fileName = _a.fileName, uniqueSettings = _a.uniqueSettings;
    var theme = (0, styles_1.useTheme)();
    var _b = (0, react_query_1.useQuery)({
        queryKey: dbApi_1.DbApi.AvailableLanguagesData.makeQueryKey(fileName),
        queryFn: function () { return dbApi_1.DbApi.AvailableLanguagesData.call(fileName); },
    }), data = _b.data, isLoading = _b.isLoading;
    var _c = (0, use_query_params_1.useQueryParam)(uniqueSettings.remote.availableLanguages, use_query_params_1.ArrayParam), selectedLanguages = _c[0], setSelectedLanguages = _c[1];
    /* eslint-disable react-hooks/exhaustive-deps */
    React.useEffect(function () {
        if (!selectedLanguages) {
            setSelectedLanguages(data);
        }
    }, [setSelectedLanguages, isLoading]);
    var handleChange = function (event) {
        var value = event.target.value;
        setSelectedLanguages(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value);
    };
    var selectorLabel = t("optionsLabels.availableLanguages");
    return (<material_1.Box sx={{ width: 1, my: 2 }}>
      <material_1.FormControl sx={{ width: 1 }}>
        <material_1.InputLabel id="text-languages-selector-label">
          {selectorLabel}
        </material_1.InputLabel>
        <Select_1.default labelId="text-languages-selector-label" id="text-languages" value={isLoading ? ["loading"] : __spreadArray([], (selectedLanguages !== null && selectedLanguages !== void 0 ? selectedLanguages : []), true)} input={<OutlinedInput_1.default label={selectorLabel}/>} MenuProps={MenuProps} renderValue={function (selected) {
            var renderedSelection = selected
                ? selected
                    .map(function (selection) {
                    return t("dbLanguageLabels.".concat(selection));
                })
                    .join(", ")
                : "";
            return renderedSelection;
        }} multiple displayEmpty onChange={handleChange}>
          {data === null || data === void 0 ? void 0 : data.map(function (lang) {
            return (<material_1.MenuItem key={lang} value={lang} style={getStyles(lang, selectedLanguages, theme)}>
                <Checkbox_1.default checked={selectedLanguages ? selectedLanguages.includes(lang) : false}/>
                <material_1.ListItemText primary={t("dbLanguageLabels.".concat(lang))}/>
              </material_1.MenuItem>);
        })}
        </Select_1.default>
      </material_1.FormControl>
    </material_1.Box>);
};
exports.default = SourceLanguagesSelector;
// {isLoading ? (
//   <Select
//     labelId="text-languages-selector-label"
//     id="text-languages"
//     value={selectedLanguages ?? []}
//     input={
//       <OutlinedInput label={selectorLabel} />
//     }
//     MenuProps={MenuProps}
//     multiple
//     displayEmpty
//     onChange={handleChange}
//   >
//     <MenuItem value="loading">
//       <CircularProgress color="inherit" size={20} />
//     </MenuItem>
//   </Select>
// ) : (
// )}
