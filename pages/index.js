"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaticProps = void 0;
var react_1 = require("react");
var next_i18next_1 = require("next-i18next");
var ContentLanguageSelector_1 = require("@components/layout/ContentLanguageSelector");
var Footer_1 = require("@components/layout/Footer");
var PageContainer_1 = require("@components/layout/PageContainer");
var theme_1 = require("@components/theme");
var material_1 = require("@mui/material");
var Box_1 = require("@mui/material/Box");
var styles_1 = require("@mui/material/styles");
var Typography_1 = require("@mui/material/Typography");
var utils_1 = require("@mui/utils");
var react_query_1 = require("@tanstack/react-query");
var merge_1 = require("lodash/merge");
var constants_1 = require("utils/constants");
var nextJsHelpers_1 = require("utils/nextJsHelpers");
function Home() {
    var _a, _b, _c;
    var t = (0, next_i18next_1.useTranslation)().t;
    var theme = (0, material_1.useTheme)();
    var materialTheme = (0, styles_1.useTheme)();
    return (<PageContainer_1.PageContainer backgroundName="welcome">
      <Box_1.default component="img" src="/assets/icons/full-logo.svg" height="30vh" alt="buddhanexus logo" sx={_a = {
                p: 4
            },
            _a[materialTheme.breakpoints.down("sm")] = {
                p: 3,
                m: 2,
            },
            _a.backgroundColor = materialTheme.palette.background.header,
            _a.borderBottom = "1px solid ".concat(theme.palette.background.accent),
            _a.borderRadiusTopLeft = 1,
            _a.borderRadiusTopRights = 1,
            _a}/>
      <material_1.Paper elevation={1} sx={_b = {
                p: 4,
                mt: 0,
                mb: 4
            },
            _b[materialTheme.breakpoints.down("sm")] = {
                p: 3,
                mx: 2,
                mb: 2,
            },
            _b}>
        <Typography_1.default component="h1" sx={utils_1.visuallyHidden}>
          {t("global.siteTitle")}
        </Typography_1.default>
        <Typography_1.default align="center" variant="body1" sx={{ fontFamily: theme_1.sourceSerif.style.fontFamily }}>
          {t("home:intro")}
        </Typography_1.default>

        <Box_1.default sx={_c = {
                display: "flex",
                my: 2,
                flexWrap: "wrap"
            },
            _c[materialTheme.breakpoints.down("sm")] = {
                flexDirection: "column",
            },
            _c}>
          <ContentLanguageSelector_1.ContentLanguageSelector title="Pāli" href={"/db/".concat(constants_1.SourceLanguage.PALI)} color={theme.palette.common.pali}/>
          <ContentLanguageSelector_1.ContentLanguageSelector title="Sanskrit" href={"/db/".concat(constants_1.SourceLanguage.SANSKRIT)} color={theme.palette.common.sanskrit}/>
          <ContentLanguageSelector_1.ContentLanguageSelector title="Tibetan" href={"/db/".concat(constants_1.SourceLanguage.TIBETAN)} color={theme.palette.common.tibetan}/>
          <ContentLanguageSelector_1.ContentLanguageSelector title="Chinese" href={"/db/".concat(constants_1.SourceLanguage.CHINESE)} color={theme.palette.common.chinese}/>
        </Box_1.default>
      </material_1.Paper>
      <Footer_1.Footer />
    </PageContainer_1.PageContainer>);
}
exports.default = Home;
var getStaticProps = function (_a) {
    var locale = _a.locale;
    return __awaiter(void 0, void 0, void 0, function () {
        var i18nProps, queryClient;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, nextJsHelpers_1.getI18NextStaticProps)({
                        locale: locale,
                    }, ["common", "home"])];
                case 1:
                    i18nProps = _b.sent();
                    queryClient = new react_query_1.QueryClient();
                    return [2 /*return*/, (0, merge_1.default)({ props: { dehydratedState: (0, react_query_1.dehydrate)(queryClient) } }, i18nProps)];
            }
        });
    });
};
exports.getStaticProps = getStaticProps;
