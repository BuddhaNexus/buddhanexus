"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterSettings = void 0;
var react_1 = require("react");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var useDbView_1 = require("@components/hooks/useDbView");
var material_1 = require("@mui/material");
var dbSidebarHelpers_1 = require("features/sidebarSuite/common/dbSidebarHelpers");
var SidebarSuite_1 = require("features/sidebarSuite/SidebarSuite");
var settings_1 = require("features/sidebarSuite/subComponents/settings");
var jotai_1 = require("jotai");
var use_query_params_1 = require("use-query-params");
var FilterSettings = function (_a) {
    var _b = _a.pageType, pageType = _b === void 0 ? "db" : _b;
    var currentView = (0, jotai_1.useAtomValue)(useDbView_1.currentViewAtom);
    var _c = (0, useDbQueryParams_1.useDbQueryParams)(), sourceLanguage = _c.sourceLanguage, settingRenderGroups = _c.settingRenderGroups, uniqueSettings = _c.uniqueSettings, settingsOmissionsConfig = _c.settingsOmissionsConfig;
    var currentLang = (0, use_query_params_1.useQueryParam)(settingRenderGroups.searchPageFilter.language, use_query_params_1.StringParam)[0];
    var filters = (0, react_1.useMemo)(function () {
        var filterList = Object.values(pageType === "search"
            ? settingRenderGroups.searchPageFilter
            : settingRenderGroups.dbPageFilter);
        if (pageType === "search") {
            if (!currentLang || currentLang === "all") {
                return filterList.filter(
                // This value is linked to the "include exclude" param switch statement case below and is used to identify the whole block of filters
                function (value) { return value !== uniqueSettings.queryParams.limits; });
            }
            return filterList;
        }
        return filterList.filter(function (filter) {
            return !(0, dbSidebarHelpers_1.isSettingOmitted)({
                omissions: settingsOmissionsConfig.filters,
                settingName: filter,
                language: sourceLanguage,
                view: currentView,
            });
        });
    }, [
        pageType,
        currentLang,
        sourceLanguage,
        currentView,
        settingsOmissionsConfig,
        settingRenderGroups,
        uniqueSettings,
    ]);
    return filters.length > 0 ? (<material_1.Box>
      {filters.map(function (filter) {
            var key = "filter-setting-".concat(filter);
            switch (filter) {
                case uniqueSettings.queryParams.language: {
                    return <settings_1.SearchLanguageSelector key={key}/>;
                }
                case uniqueSettings.queryParams.score: {
                    return <settings_1.ScoreFilter key={key}/>;
                }
                case uniqueSettings.queryParams.parLength: {
                    return <settings_1.ParLengthFilter key={key}/>;
                }
                case uniqueSettings.queryParams.limits: {
                    return <settings_1.IncludeExcludeFilters key={key}/>;
                }
                case uniqueSettings.queryParams.targetCollection: {
                    return (<react_1.Fragment key={key}>
                {(0, SidebarSuite_1.StandinSetting)("target_collection")}
              </react_1.Fragment>);
                }
                default: {
                    return null;
                }
            }
        })}
    </material_1.Box>) : null;
};
exports.FilterSettings = FilterSettings;
