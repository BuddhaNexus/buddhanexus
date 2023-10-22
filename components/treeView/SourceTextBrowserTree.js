"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceTextBrowserTree = void 0;
var react_1 = require("react");
var react_arborist_1 = require("react-arborist");
var react_cool_dimensions_1 = require("react-cool-dimensions");
var next_i18next_1 = require("next-i18next");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var DrawerNavigationComponents_1 = require("@components/treeView/DrawerNavigationComponents");
var Search_1 = require("@mui/icons-material/Search");
var material_1 = require("@mui/material");
var react_query_1 = require("@tanstack/react-query");
var dbApi_1 = require("utils/api/dbApi");
// https://github.com/brimdata/react-arborist
var TreeViewContent = (0, react_1.memo)(function TreeViewContent(_a) {
    var data = _a.data, height = _a.height, width = _a.width, searchTerm = _a.searchTerm;
    return (<react_arborist_1.Tree searchTerm={searchTerm} initialData={data} openByDefault={false} disableDrag={true} rowHeight={60} disableDrop={true} disableEdit={true} padding={12} height={height} width={width}>
      {DrawerNavigationComponents_1.Node}
    </react_arborist_1.Tree>);
});
exports.SourceTextBrowserTree = (0, react_1.memo)(function SourceTextBrowserTree(_a) {
    var parentHeight = _a.parentHeight, parentWidth = _a.parentWidth;
    var _b = (0, react_1.useState)(""), searchTerm = _b[0], setSearchTerm = _b[1];
    var sourceLanguage = (0, useDbQueryParams_1.useDbQueryParams)().sourceLanguage;
    var _c = (0, react_cool_dimensions_1.default)(), observe = _c.observe, inputHeight = _c.height;
    var t = (0, next_i18next_1.useTranslation)(["common", "settings"]).t;
    // TODO: add error handling
    var _d = (0, react_query_1.useQuery)({
        queryKey: dbApi_1.DbApi.SidebarSourceTexts.makeQueryKey(sourceLanguage),
        queryFn: function () { return dbApi_1.DbApi.SidebarSourceTexts.call(sourceLanguage); },
    }), data = _d.data, isLoading = _d.isLoading;
    var hasData = !(isLoading || !data);
    var languageName = t("settings:dbLanguageLabels.".concat(sourceLanguage));
    return (<>
        <material_1.Typography variant="h5" sx={{ p: 2, pb: 0 }}>
          {t("textBrowser.mainPrompt", { languageName: languageName })}
        </material_1.Typography>

        <material_1.Divider />

        {hasData && (<>
            {/* Search input */}
            <material_1.FormControl ref={observe} variant="outlined" sx={{ p: 2, pb: 0 }} fullWidth>
              <material_1.TextField label="Search" InputProps={{
                endAdornment: (<material_1.InputAdornment position="end">
                      <Search_1.default />
                    </material_1.InputAdornment>),
            }} onChange={function (event) { return setSearchTerm(event.target.value); }}/>
            </material_1.FormControl>

            {/* Tree view - text browser */}
            <material_1.Box sx={{ pl: 2 }}>
              <TreeViewContent data={data} height={parentHeight - inputHeight} width={parentWidth} searchTerm={searchTerm}/>
            </material_1.Box>
          </>)}

        <material_1.Backdrop open={!hasData}>
          <material_1.CircularProgress />
        </material_1.Backdrop>
      </>);
});
