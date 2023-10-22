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
function normalizeValue(value, min) {
    if (!value || value < min) {
        return min;
    }
    // TODO set dynamic max
    if (value > 4000) {
        return 4000;
    }
    return value;
}
function ParLengthFilter() {
    var t = (0, next_i18next_1.useTranslation)("settings").t;
    var _a = (0, useDbQueryParams_1.useDbQueryParams)(), parLengthConfig = _a.parLengthConfig, uniqueSettings = _a.uniqueSettings;
    var _b = (0, use_query_params_1.useQueryParam)(uniqueSettings.queryParams.parLength, use_query_params_1.NumberParam), parLengthParam = _b[0], setParLengthParam = _b[1];
    var _c = (0, react_1.useState)(parLengthParam !== null && parLengthParam !== void 0 ? parLengthParam : parLengthConfig.default), parLength = _c[0], setParLength = _c[1];
    (0, react_1.useEffect)(function () {
        setParLength(parLengthParam !== null && parLengthParam !== void 0 ? parLengthParam : parLengthConfig.default);
    }, [parLengthParam, parLengthConfig.default]);
    var setDebouncedParLengthParam = (0, react_1.useMemo)(function () { return (0, lodash_1.debounce)(setParLengthParam, 600); }, [setParLengthParam]);
    var handleChange = (0, react_1.useCallback)(function (value) {
        var normalizedValue = normalizeValue(value, parLengthConfig.min);
        setParLength(value);
        setDebouncedParLengthParam(normalizedValue);
    }, [parLengthConfig.min, setParLength, setDebouncedParLengthParam]);
    var marks = [
        {
            value: parLengthConfig.min,
            label: "".concat(parLengthConfig.min),
        },
        // TODO set dynamic max
        {
            value: 4000,
            label: "4000",
        },
    ];
    return (<material_1.Box sx={{ width: 1 }}>
      <material_1.FormLabel id="min-match-input-label">
        {t("filtersLabels.minMatch")}
      </material_1.FormLabel>
      {/* TODO: define acceptance criteria for input change handling */}
      <material_1.TextField sx={{ width: 1, my: 1 }} value={parLength !== null && parLength !== void 0 ? parLength : ""} type="number" inputProps={{
            min: 0,
            max: 4000,
            type: "number",
            "aria-labelledby": "min-match-input-label",
        }} onChange={function (e) { return handleChange(Number(e.target.value)); }}/>
      <material_1.Box sx={{ ml: 1, width: "96%" }}>
        <material_1.Slider value={parLength !== null && parLength !== void 0 ? parLength : parLengthConfig.default} aria-labelledby="min-match-input-label" getAriaValueText={valueToString} min={0} max={4000} marks={marks} onChange={function (_, value) { return handleChange(Number(value)); }}/>
      </material_1.Box>
    </material_1.Box>);
}
exports.default = ParLengthFilter;
