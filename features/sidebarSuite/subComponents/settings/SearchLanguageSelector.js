"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var next_i18next_1 = require("next-i18next");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var material_1 = require("@mui/material");
var use_query_params_1 = require("use-query-params");
var constants_1 = require("utils/constants");
var SearchLanguageSelector = function () {
    var t = (0, next_i18next_1.useTranslation)("settings").t;
    var uniqueSettings = (0, useDbQueryParams_1.useDbQueryParams)().uniqueSettings;
    var _a = (0, use_query_params_1.useQueryParam)(uniqueSettings.queryParams.language, use_query_params_1.StringParam), currentLang = _a[0], setCurrentDbLang = _a[1];
    return (<material_1.FormControl variant="filled" sx={{ width: 1, mb: 2 }}>
      <material_1.InputLabel id="db-language-selector-label" sx={{ mb: 1 }}>
        {t("dbLanguageLabels.instructions")}
      </material_1.InputLabel>
      <material_1.Select labelId="db-language-selector-label" id="db-language-selector" value={currentLang !== null && currentLang !== void 0 ? currentLang : "all"} onChange={function (e) {
            return setCurrentDbLang(e.target.value === "all" ? undefined : e.target.value);
        }}>
        <material_1.MenuItem key="all" value="all">
          {t("dbLanguageLabels.all")}
        </material_1.MenuItem>
        {Object.values(constants_1.SourceLanguage).map(function (option) { return (<material_1.MenuItem key={option} value={option}>
            {t("dbLanguageLabels.".concat(option))}
          </material_1.MenuItem>); })}
      </material_1.Select>
    </material_1.FormControl>);
};
exports.default = SearchLanguageSelector;
