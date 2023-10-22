"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIThemeProvider = void 0;
var react_1 = require("react");
var next_themes_1 = require("next-themes");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var theme_1 = require("@components/theme");
var styles_1 = require("@mui/material/styles");
var MUIThemeProvider = function (_a) {
    var children = _a.children;
    var theme = (0, next_themes_1.useTheme)().theme;
    var _b = (0, react_1.useState)(false), isMounted = _b[0], setIsMounted = _b[1];
    var sourceLanguage = (0, useDbQueryParams_1.useDbQueryParams)().sourceLanguage;
    (0, react_1.useEffect)(function () {
        setIsMounted(true);
    }, []);
    var MUITheme = (0, react_1.useMemo)(function () {
        return (0, styles_1.responsiveFontSizes)((0, styles_1.createTheme)((0, theme_1.getDesignTokens)({
            mode: isMounted ? (theme === "light" ? "light" : "dark") : "light",
            sourceLanguage: sourceLanguage,
        })));
    }, [isMounted, sourceLanguage, theme]);
    return (<styles_1.ThemeProvider key={theme} theme={MUITheme}>
      {children}
    </styles_1.ThemeProvider>);
};
exports.MUIThemeProvider = MUIThemeProvider;
