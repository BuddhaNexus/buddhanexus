"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var next_i18next_1 = require("next-i18next");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var material_1 = require("@mui/material");
var atoms_1 = require("features/atoms");
var jotai_1 = require("jotai");
var SCRIPT_OPTIONS = {
    tib: ["Unicode", "Wylie"],
};
var DEFAULT_SCRIPT = "Unicode";
// TODO: add convertion to text-view on view completion
function TextScriptOption() {
    var _a;
    var sourceLanguage = (0, useDbQueryParams_1.useDbQueryParams)().sourceLanguage;
    var t = (0, next_i18next_1.useTranslation)("settings").t;
    var _b = (0, jotai_1.useAtom)(atoms_1.scriptSelectionAtom), scriptSelection = _b[0], setScriptSelection = _b[1];
    React.useEffect(function () {
        var storedSelection = window.localStorage.getItem("tibetan-script-selection");
        if (storedSelection && storedSelection !== "undefined") {
            setScriptSelection(JSON.parse(storedSelection));
        }
    }, [setScriptSelection]);
    React.useEffect(function () {
        window.localStorage.setItem("tibetan-script-selection", JSON.stringify(scriptSelection));
    }, [scriptSelection]);
    return (<material_1.FormControl sx={{ width: 1 }}>
      <material_1.FormLabel id="tibetan-script-selection-label">
        {t("optionsLabels.script")}
      </material_1.FormLabel>

      <material_1.Select id="sort-option-selector" aria-labelledby="sort-option-selector-label" defaultValue="position" value={scriptSelection !== null && scriptSelection !== void 0 ? scriptSelection : DEFAULT_SCRIPT} onChange={function (e) { return setScriptSelection(e.target.value); }}>
        {(_a = SCRIPT_OPTIONS[sourceLanguage]) === null || _a === void 0 ? void 0 : _a.map(function (script) {
            return (<material_1.MenuItem key={script} value={script}>
              {script}
            </material_1.MenuItem>);
        })}
      </material_1.Select>
    </material_1.FormControl>);
}
exports.default = TextScriptOption;
