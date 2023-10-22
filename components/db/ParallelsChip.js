"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var next_i18next_1 = require("next-i18next");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var Box_1 = require("@mui/material/Box");
var Chip_1 = require("@mui/material/Chip");
var react_query_1 = require("@tanstack/react-query");
var dbApi_1 = require("utils/api/dbApi");
function ParallelsChip() {
    var t = (0, next_i18next_1.useTranslation)("settings").t;
    var _a = (0, useDbQueryParams_1.useDbQueryParams)(), fileName = _a.fileName, queryParams = _a.queryParams;
    // ignore some params that shouldn't result in refetching this query
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var selectedSegment = queryParams.selectedSegment, restOfQueryParams = __rest(queryParams, ["selectedSegment"]);
    var _b = (0, react_query_1.useQuery)({
        // TODO: - see if the query can return result before main results
        queryKey: dbApi_1.DbApi.ParallelCount.makeQueryKey({
            fileName: fileName,
            queryParams: restOfQueryParams,
        }),
        queryFn: function () {
            return dbApi_1.DbApi.ParallelCount.call({
                fileName: fileName,
                queryParams: queryParams,
            });
        },
        refetchOnWindowFocus: false,
    }), data = _b.data, isLoading = _b.isLoading;
    var _c = (0, react_1.useState)(isLoading ? 0 : data === null || data === void 0 ? void 0 : data.parallel_count), parallelCount = _c[0], setParallelCount = _c[1];
    (0, react_1.useEffect)(function () {
        if (data) {
            setParallelCount(data.parallel_count);
        }
    }, [data]);
    return (<Chip_1.default size="small" label={<Box_1.default sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box_1.default>{t("resultsHead.parallels")}</Box_1.default>
          <Box_1.default sx={{ minWidth: "2ch", ml: "3px", textAlign: "center" }}>
            {parallelCount}
          </Box_1.default>
        </Box_1.default>} sx={{ mx: 0.5, p: 0.5 }}/>);
}
exports.default = ParallelsChip;
