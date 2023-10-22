"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var next_i18next_1 = require("next-i18next");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var material_1 = require("@mui/material");
var lodash_1 = require("lodash");
var use_query_params_1 = require("use-query-params");
function valueToString(value) {
    return "".concat(value);
}
function normalizeValue(value) {
    if (!value || value < 0) {
        return 0;
    }
    if (value > 100) {
        return 100;
    }
    return value;
}
function ScoreFilter() {
    var t = (0, next_i18next_1.useTranslation)("settings").t;
    var _a = (0, useDbQueryParams_1.useDbQueryParams)(), defaultParamConfig = _a.defaultParamConfig, uniqueSettings = _a.uniqueSettings;
    var _b = (0, use_query_params_1.useQueryParam)(uniqueSettings.queryParams.score, use_query_params_1.NumberParam), scoreParam = _b[0], setScoreParam = _b[1];
    var _c = (0, react_1.useState)(scoreParam !== null && scoreParam !== void 0 ? scoreParam : defaultParamConfig.score), scoreValue = _c[0], setScoreValue = _c[1];
    (0, react_1.useEffect)(function () {
        setScoreValue(scoreParam !== null && scoreParam !== void 0 ? scoreParam : defaultParamConfig.score);
    }, [defaultParamConfig, scoreParam]);
    var setDebouncedScoreParam = (0, react_1.useMemo)(function () { return (0, lodash_1.debounce)(setScoreParam, 600); }, [setScoreParam]);
    var handleChange = (0, react_1.useCallback)(function (value) {
        var normalizedValue = normalizeValue(value);
        setScoreValue(value);
        setDebouncedScoreParam(normalizedValue);
    }, [setScoreValue, setDebouncedScoreParam]);
    var handleBlur = function () {
        setScoreValue(normalizeValue(scoreValue));
    };
    var marks = [
        {
            value: 0,
            label: "".concat(0, "%"),
        },
        {
            value: 100,
            label: "100%",
        },
    ];
    return (<material_1.Box sx={{ width: 1, mb: 2 }}>
      <material_1.FormLabel id="score-input-label">{t("filtersLabels.score")}</material_1.FormLabel>
      <material_1.TextField sx={{ width: 1, my: 1 }} value={scoreValue} type="number" inputProps={{
            step: 1,
            min: 0,
            max: 100,
            type: "number",
            "aria-labelledby": "score-input-label",
        }} onBlur={handleBlur} onChange={function (e) { return handleChange(Number(e.target.value)); }}/>
      <material_1.Box sx={{ ml: 1, width: "96%" }}>
        <material_1.Slider value={scoreValue} aria-labelledby="score-input-label" getAriaValueText={valueToString} min={0} max={100} marks={marks} onChange={function (_, value) { return handleChange(Number(value)); }}/>
      </material_1.Box>
    </material_1.Box>);
}
exports.default = ScoreFilter;
