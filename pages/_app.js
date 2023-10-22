"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("globalStyles.css");
var react_1 = require("react");
var head_1 = require("next/head");
var next_i18next_1 = require("next-i18next");
var next_i18next_config_1 = require("next-i18next.config");
var next_query_params_1 = require("next-query-params");
var next_seo_1 = require("next-seo");
var next_seo_config_1 = require("next-seo.config");
var next_themes_1 = require("next-themes");
var AppTopBar_1 = require("@components/layout/AppTopBar");
var react_2 = require("@emotion/react");
var CssBaseline_1 = require("@mui/material/CssBaseline");
var react_query_1 = require("@tanstack/react-query");
var react_query_devtools_1 = require("@tanstack/react-query-devtools");
var query_string_1 = require("query-string");
var use_query_params_1 = require("use-query-params");
var createEmotionCache_1 = require("utils/createEmotionCache");
var MUIThemeProvider_1 = require("utils/MUIThemeProvider");
// Client-side cache, shared for the whole session of the user in the browser.
var clientSideEmotionCache = (0, createEmotionCache_1.default)();
function MyApp(_a) {
    var Component = _a.Component, pageProps = _a.pageProps, _b = _a.emotionCache, emotionCache = _b === void 0 ? clientSideEmotionCache : _b;
    var queryClient = react_1.default.useState(function () {
        return new react_query_1.QueryClient({
            defaultOptions: { queries: { refetchOnWindowFocus: false } },
        });
    })[0];
    return (<react_2.CacheProvider value={emotionCache}>
      <use_query_params_1.QueryParamProvider adapter={next_query_params_1.NextAdapter} options={{
            searchStringToObject: query_string_1.default.parse,
            objectToSearchString: query_string_1.default.stringify,
            updateType: "replaceIn",
            enableBatching: true,
        }}>
        <react_query_1.QueryClientProvider client={queryClient}>
          <react_query_1.HydrationBoundary state={pageProps.dehydratedState}>
            <next_seo_1.DefaultSeo {...next_seo_config_1.default}/>
            <head_1.default>
              <meta name="viewport" content="initial-scale=1, width=device-width"/>
            </head_1.default>

            <next_themes_1.ThemeProvider>
              <MUIThemeProvider_1.MUIThemeProvider>
                <CssBaseline_1.default />
                <AppTopBar_1.AppTopBar />
                <Component {...pageProps}/>
              </MUIThemeProvider_1.MUIThemeProvider>
            </next_themes_1.ThemeProvider>
          </react_query_1.HydrationBoundary>
          <react_query_devtools_1.ReactQueryDevtools />
        </react_query_1.QueryClientProvider>
      </use_query_params_1.QueryParamProvider>
    </react_2.CacheProvider>);
}
exports.default = (0, next_i18next_1.appWithTranslation)(MyApp, next_i18next_config_1.default);
