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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.getStaticProps = void 0;
var react_1 = require("react");
var router_1 = require("next/router");
var QueryPageTopStack_1 = require("@components/db/QueryPageTopStack");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var useGlobalSearch_1 = require("@components/hooks/useGlobalSearch");
var useSourceFile_1 = require("@components/hooks/useSourceFile");
var PageContainer_1 = require("@components/layout/PageContainer");
var icons_material_1 = require("@mui/icons-material");
var material_1 = require("@mui/material");
var react_query_1 = require("@tanstack/react-query");
var GlobalSearchStyledMuiComponents_1 = require("features/globalSearch/GlobalSearchStyledMuiComponents");
var sourceTextBrowserDrawer_1 = require("features/sourceTextBrowserDrawer/sourceTextBrowserDrawer");
var dbApi_1 = require("utils/api/dbApi");
var nextJsHelpers_1 = require("utils/nextJsHelpers");
function SearchPage() {
    // IN DEVELOPMENT
    var isReady = (0, router_1.useRouter)().isReady;
    var _a = (0, useDbQueryParams_1.useDbQueryParams)(), sourceLanguage = _a.sourceLanguage, queryParams = _a.queryParams;
    var isFallback = (0, useSourceFile_1.useSourceFile)().isFallback;
    var _b = (0, useGlobalSearch_1.useGlobalSearch)(), handleOnSearch = _b.handleOnSearch, searchParam = _b.searchParam;
    var _c = (0, react_1.useState)(searchParam), searchTerm = _c[0], setSearchTerm = _c[1];
    (0, react_1.useEffect)(function () {
        if (isReady) {
            // enables search term to be set from URL if user accesses the site via a results page link
            setSearchTerm(searchParam);
        }
    }, [isReady, setSearchTerm, searchParam]);
    // TODO: data / query handling (awaiting endpoints update & codegen types to be impletmented)
    var _d = (0, react_query_1.useInfiniteQuery)({
        initialPageParam: 0,
        queryKey: dbApi_1.DbApi.GlobalSearchData.makeQueryKey({
            searchTerm: searchParam,
            queryParams: queryParams,
        }),
        queryFn: function (_a) {
            var pageParam = _a.pageParam;
            return dbApi_1.DbApi.GlobalSearchData.call({
                searchTerm: searchParam,
                pageNumber: pageParam,
                queryParams: queryParams,
            });
        },
        getNextPageParam: function (lastPage) { return lastPage.pageNumber + 1; },
        getPreviousPageParam: function (lastPage) {
            return lastPage.pageNumber === 0 ? lastPage.pageNumber : lastPage.pageNumber - 1;
        },
    }), data = _d.data, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchNextPage = _d.fetchNextPage, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchPreviousPage = _d.fetchPreviousPage, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isInitialLoading = _d.isInitialLoading, isLoading = _d.isLoading;
    if (isFallback || !isReady) {
        return (<PageContainer_1.PageContainer maxWidth="xl" backgroundName={sourceLanguage}>
        <material_1.CircularProgress color="inherit" sx={{ flex: 1 }}/>
      </PageContainer_1.PageContainer>);
    }
    return (<PageContainer_1.PageContainer maxWidth="xl" backgroundName={sourceLanguage} hasSidebar={true}>
      <QueryPageTopStack_1.QueryPageTopStack />
      <GlobalSearchStyledMuiComponents_1.SearchBoxWrapper sx={{ mb: 5 }}>
        {/* TODO: fix search OR add notification of search limitations (whole word only) */}
        <GlobalSearchStyledMuiComponents_1.SearchBoxInput placeholder="Enter search term" value={searchTerm !== null && searchTerm !== void 0 ? searchTerm : ""} variant="outlined" InputProps={{
            startAdornment: (<material_1.IconButton onClick={function () { return handleOnSearch(searchTerm); }}>
                <icons_material_1.Search />
              </material_1.IconButton>),
            endAdornment: (<material_1.IconButton onClick={function () { return setSearchTerm(""); }}>
                <icons_material_1.Close />
              </material_1.IconButton>),
        }} 
    // eslint-disable-next-line jsx-a11y/no-autofocus
    autoFocus fullWidth onChange={function (event) { return setSearchTerm(event.target.value); }} onKeyDown={function (e) { return handleOnSearch(searchTerm, e); }}/>
      </GlobalSearchStyledMuiComponents_1.SearchBoxWrapper>

      {/* TODO: componentize search results */}
      {!isLoading && (<>
          {data ? (<>
              {data.pages.flatMap(function (page) {
                    var _a;
                    return (<react_1.default.Fragment key={page.pageNumber}>
                  <material_1.Typography>{page.data.total} Results</material_1.Typography>
                  <material_1.Grid rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} container>
                    <ul>
                      {__spreadArray([], ((_a = page.data.results.values()) !== null && _a !== void 0 ? _a : []), true).map(function (result) { return (<li key={result.id}>
                          <material_1.Typography variant="h3" component="h2">
                            {result.id}
                          </material_1.Typography>
                          <material_1.Typography component="p">
                            {result.fileName}
                          </material_1.Typography>
                        </li>); })}
                    </ul>
                  </material_1.Grid>
                </react_1.default.Fragment>);
                })}
            </>) : (<>
              {/* TODO: i18n */}
              <material_1.Typography>No results.</material_1.Typography>
            </>)}
        </>)}

      <sourceTextBrowserDrawer_1.SourceTextBrowserDrawer />
    </PageContainer_1.PageContainer>);
}
exports.default = SearchPage;
var getStaticProps = function (_a) {
    var locale = _a.locale;
    return __awaiter(void 0, void 0, void 0, function () {
        var i18nProps;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, nextJsHelpers_1.getI18NextStaticProps)({
                        locale: locale,
                    }, ["settings"])];
                case 1:
                    i18nProps = _b.sent();
                    return [2 /*return*/, {
                            props: __assign({}, i18nProps.props),
                        }];
            }
        });
    });
};
exports.getStaticProps = getStaticProps;
