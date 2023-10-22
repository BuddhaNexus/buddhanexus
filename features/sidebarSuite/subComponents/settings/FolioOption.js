"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var next_i18next_1 = require("next-i18next");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var material_1 = require("@mui/material");
var Box_1 = require("@mui/material/Box");
var react_query_1 = require("@tanstack/react-query");
var use_query_params_1 = require("use-query-params");
var dbApi_1 = require("utils/api/dbApi");
// TODO: add handling for functionality change for different views (jump to / only show)
function FolioOption() {
    var t = (0, next_i18next_1.useTranslation)("settings").t;
    var _a = (0, useDbQueryParams_1.useDbQueryParams)(), fileName = _a.fileName, defaultParamConfig = _a.defaultParamConfig, uniqueSettings = _a.uniqueSettings;
    var _b = (0, react_query_1.useQuery)({
        queryKey: dbApi_1.DbApi.FolioData.makeQueryKey(fileName),
        queryFn: function () { return dbApi_1.DbApi.FolioData.call(fileName); },
    }), data = _b.data, isLoading = _b.isLoading;
    var _c = (0, use_query_params_1.useQueryParam)(uniqueSettings.queryParams.folio, use_query_params_1.StringParam), folioParam = _c[0], setFolioParam = _c[1];
    (0, react_1.useEffect)(function () {
        setFolioParam(folioParam !== null && folioParam !== void 0 ? folioParam : defaultParamConfig.folio);
    }, [folioParam, setFolioParam, defaultParamConfig]);
    var showAll = t("optionsLabels.folioShowAll");
    var handleSelectChange = function (value) {
        setFolioParam(value === showAll ? null : value);
    };
    var selectorLabel = t("optionsLabels.folioAsLimit");
    return (<Box_1.default sx={{ width: 1, my: 2 }}>
      <material_1.FormControl sx={{ width: 1 }} title={selectorLabel}>
        <material_1.InputLabel id="folio-option-selector-label">
          {selectorLabel}
        </material_1.InputLabel>
        {isLoading ? (<material_1.Select labelId="folio-option-selector-label" id="folio-option-selector" value={showAll} input={<material_1.OutlinedInput label={selectorLabel}/>} displayEmpty>
            <material_1.MenuItem value={showAll}>
              <em>{showAll}</em>
            </material_1.MenuItem>
            <material_1.MenuItem value="loading">
              <material_1.CircularProgress color="inherit" size={20}/>
            </material_1.MenuItem>
          </material_1.Select>) : (<material_1.Select labelId="folio-option-selector-label" id="folio-option-selector" input={<material_1.OutlinedInput label={selectorLabel}/>} value={folioParam !== null && folioParam !== void 0 ? folioParam : showAll} displayEmpty onChange={function (e) { return handleSelectChange(e.target.value); }}>
            <material_1.MenuItem value={showAll}>
              <em>{showAll}</em>
            </material_1.MenuItem>
            {data &&
                data.length > 1 &&
                data.map(function (folio) {
                    return (<material_1.MenuItem key={folio.id} value={folio.id}>
                    {folio.segmentNr}
                  </material_1.MenuItem>);
                })}
          </material_1.Select>)}
      </material_1.FormControl>
    </Box_1.default>);
}
exports.default = FolioOption;
