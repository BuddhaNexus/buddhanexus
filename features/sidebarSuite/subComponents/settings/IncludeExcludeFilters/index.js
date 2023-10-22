"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var useDbMenus_1 = require("@components/hooks/useDbMenus");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var material_1 = require("@mui/material");
var types_1 = require("features/sidebarSuite/config/types");
var lodash_1 = require("lodash");
var use_query_params_1 = require("use-query-params");
var uiComponents_1 = require("./uiComponents");
var IncludeExcludeFilters = function () {
    var t = (0, react_i18next_1.useTranslation)("settings").t;
    var _a = (0, useDbQueryParams_1.useDbQueryParams)(), defaultParamConfig = _a.defaultParamConfig, uniqueSettings = _a.uniqueSettings;
    var _b = (0, useDbMenus_1.useDbMenus)(), texts = _b.texts, isLoadingTexts = _b.isLoadingTexts, categories = _b.categories, isLoadingCategories = _b.isLoadingCategories;
    var _c = (0, use_query_params_1.useQueryParam)(uniqueSettings.queryParams.limits, use_query_params_1.JsonParam), limitsParam = _c[0], setLimitsParam = _c[1];
    var _d = (0, react_1.useState)({}), limitsValue = _d[0], setLimitsValue = _d[1];
    (0, react_1.useEffect)(function () { return setLimitsParam(limitsParam !== null && limitsParam !== void 0 ? limitsParam : defaultParamConfig.limits); }, [limitsParam, setLimitsParam, defaultParamConfig]);
    var handleInputChange = function (limit, value) {
        var _a, _b;
        var otherLimits = (0, lodash_1.omit)(__assign({}, limitsValue), limit);
        var otherLimitParams = Object.keys(otherLimits).reduce(function (params, key) {
            var _a;
            return __assign(__assign({}, params), (_a = {}, _a[key] = otherLimits === null || otherLimits === void 0 ? void 0 : otherLimits[key].map(function (limitItem) { return limitItem.id; }), _a));
        }, {});
        var updatedLimitValues = value.length > 0 ? __assign(__assign({}, otherLimits), (_a = {}, _a[limit] = value, _a)) : otherLimits;
        setLimitsValue(updatedLimitValues);
        setLimitsParam(Object.keys(updatedLimitValues).length > 0
            ? __assign(__assign({}, otherLimitParams), (_b = {}, _b[limit] = value.map(function (limitItem) { return limitItem.id; }), _b)) : undefined);
    };
    return (<>
      <material_1.FormLabel id="exclude-include-filters-label">
        {t("filtersLabels.includeExcludeFilters")}
      </material_1.FormLabel>
      {types_1.limits.map(function (limit) {
            var filterValue = limitsValue[limit];
            var filter = limit.startsWith("file")
                ? { options: __spreadArray([], texts.values(), true), isLoading: isLoadingTexts }
                : {
                    options: __spreadArray([], categories.values(), true),
                    isLoading: isLoadingCategories,
                };
            var options = filter.options, isLoading = filter.isLoading;
            return (<material_1.Box key={limit} sx={{ my: 1, width: 1 }}>
            <material_1.Autocomplete id={limit} sx={{ mt: 1, mb: 2 }} multiple={true} value={filterValue !== null && filterValue !== void 0 ? filterValue : []} PopperComponent={uiComponents_1.StyledPopper} ListboxComponent={uiComponents_1.ListboxComponent} options={options} getOptionLabel={function (option) { return option.name.toUpperCase(); }} renderInput={function (params) { return (<material_1.TextField {...params} label={t(["filtersLabels.".concat(limit)])} InputProps={__assign(__assign({}, params.InputProps), { endAdornment: (<react_1.default.Fragment>
                        {isLoading ? (<material_1.CircularProgress color="inherit" size={20}/>) : null}
                        {params.InputProps.endAdornment}
                      </react_1.default.Fragment>) })}/>); }} renderOption={function (props, option) {
                    return [props, option];
                }} renderGroup={function (params) { return params; }} loading={isLoading} filterSelectedOptions disablePortal onChange={function (event, value) { return handleInputChange(limit, value); }}/>
          </material_1.Box>);
        })}
    </>);
};
exports.default = IncludeExcludeFilters;
