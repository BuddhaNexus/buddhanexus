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
exports.DisplayOptionsSection = void 0;
var react_1 = require("react");
var next_i18next_1 = require("next-i18next");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var useDbView_1 = require("@components/hooks/useDbView");
var material_1 = require("@mui/material");
var dbSidebarHelpers_1 = require("features/sidebarSuite/common/dbSidebarHelpers");
var PanelHeading_1 = require("features/sidebarSuite/common/PanelHeading");
var settings_1 = require("features/sidebarSuite/subComponents/settings");
var DbViewSelector_1 = require("features/sidebarSuite/subComponents/settings/DbViewSelector");
var jotai_1 = require("jotai");
// Exclusively used in DB file selection results pages and has not been refactored for options in multiple contexts (i.e. global search results page).
var DisplayOptionsSection = function () {
    var t = (0, next_i18next_1.useTranslation)("settings").t;
    var currentView = (0, jotai_1.useAtomValue)(useDbView_1.currentViewAtom);
    var _a = (0, useDbQueryParams_1.useDbQueryParams)(), sourceLanguage = _a.sourceLanguage, settingRenderGroups = _a.settingRenderGroups, uniqueSettings = _a.uniqueSettings, settingsOmissionsConfig = _a.settingsOmissionsConfig;
    var options = (0, react_1.useMemo)(function () {
        return __spreadArray(__spreadArray([], Object.values(settingRenderGroups.queriedDisplayOption), true), Object.values(settingRenderGroups.localDisplayOption), true).filter(function (option) {
            return !(0, dbSidebarHelpers_1.isSettingOmitted)({
                omissions: settingsOmissionsConfig.displayOptions,
                settingName: option,
                language: sourceLanguage,
                view: currentView,
            });
        });
    }, [
        settingRenderGroups,
        settingsOmissionsConfig.displayOptions,
        sourceLanguage,
        currentView,
    ]);
    if (options.length === 0) {
        return (<material_1.Box>
        <PanelHeading_1.default heading={t("headings.display")}/>
        <DbViewSelector_1.DbViewSelector />
      </material_1.Box>);
    }
    return (<material_1.Box>
      <PanelHeading_1.default heading={t("headings.display")} sx={{ mb: 2 }}/>

      <DbViewSelector_1.DbViewSelector />
      {options.map(function (option) {
            var key = "display-option-".concat(option);
            switch (option) {
                case uniqueSettings.queryParams.folio: {
                    return <settings_1.FolioOption key={key}/>;
                }
                case uniqueSettings.queryParams.sortMethod: {
                    return <settings_1.SortOption key={key}/>;
                }
                case uniqueSettings.remote.availableLanguages: {
                    return <settings_1.SourceLanguagesSelector key={key}/>;
                }
                // SEE: features/sidebarSuite/config/settings.ts for suspended setting info
                case uniqueSettings.local.script: {
                    return <settings_1.TextScriptOption key={key}/>;
                }
                // case uniqueSettings.local.showAndPositionSegmentNrs: {
                //   return (
                //     <React.Fragment key={key}>
                //       {StandinSetting("showAndPositionSegmentNrs")}
                //     </React.Fragment>
                //   );
                // }
                default: {
                    return null;
                }
            }
        })}
    </material_1.Box>);
};
exports.DisplayOptionsSection = DisplayOptionsSection;
