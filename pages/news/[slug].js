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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaticPaths = exports.getStaticProps = void 0;
var next_i18next_1 = require("next-i18next");
var next_mdx_remote_1 = require("next-mdx-remote");
var serialize_1 = require("next-mdx-remote/serialize");
var Link_1 = require("@components/common/Link");
var Footer_1 = require("@components/layout/Footer");
var PageContainer_1 = require("@components/layout/PageContainer");
var ArrowBackIos_1 = require("@mui/icons-material/ArrowBackIos");
var material_1 = require("@mui/material");
var fs_1 = require("fs");
var path_1 = require("path");
var mdxPageHelpers_1 = require("utils/mdxPageHelpers");
var nextJsHelpers_1 = require("utils/nextJsHelpers");
function PostPage(_a) {
    var locale = _a.locale, post = _a.post;
    var t = (0, next_i18next_1.useTranslation)().t;
    var _b = post.meta, title = _b.title, date = _b.date, _c = _b.componentList, componentList = _c === void 0 ? [] : _c, _d = _b.propsList, propsList = _d === void 0 ? [] : _d, _e = _b.importsList, importsList = _e === void 0 ? [] : _e, content = post.content;
    var pubDate = new Date(date);
    var formattedDate = pubDate.toLocaleDateString(locale, mdxPageHelpers_1.POST_DATE_OPTS);
    var _f = (0, mdxPageHelpers_1.getMDXPageComponents)({
        componentList: componentList,
        propsList: propsList,
        importsList: importsList,
    }), components = _f.components, props = _f.props;
    return (<PageContainer_1.PageContainer>
      <material_1.Paper elevation={1} sx={{ py: 3, px: 4 }}>
        <Link_1.Link href="/news">
          <material_1.Typography variant="body1" display="flex" alignItems="center">
            <ArrowBackIos_1.default fontSize="small"/>
            {t("common:news.backToNews")}
          </material_1.Typography>
        </Link_1.Link>
        <article style={{ width: "100%" }}>
          <material_1.Typography variant="h2" component="h1" mt={4}>
            {title}
          </material_1.Typography>
          <material_1.Typography variant="subtitle1">{formattedDate}</material_1.Typography>

          <next_mdx_remote_1.MDXRemote compiledSource={content.compiledSource} components={components} scope={props} frontmatter={content.frontmatter}/>
        </article>
      </material_1.Paper>
      <Footer_1.Footer />
    </PageContainer_1.PageContainer>);
}
exports.default = PostPage;
var getStaticProps = function (_a) {
    var locale = _a.locale, params = _a.params;
    return __awaiter(void 0, void 0, void 0, function () {
        var i18nProps, dirSlug, post, content;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!params) {
                        throw new Error("🙀 No params!");
                    }
                    return [4 /*yield*/, (0, nextJsHelpers_1.getI18NextStaticProps)({
                            locale: locale,
                        }, ["common"])];
                case 1:
                    i18nProps = _b.sent();
                    dirSlug = params.slug;
                    post = (0, mdxPageHelpers_1.getMDXContentBySlug)("content/news", dirSlug, locale);
                    return [4 /*yield*/, (0, serialize_1.serialize)(post.content)];
                case 2:
                    content = _b.sent();
                    return [2 /*return*/, {
                            props: __assign({ post: __assign(__assign({}, post), { content: content }), locale: locale }, i18nProps.props),
                        }];
            }
        });
    });
};
exports.getStaticProps = getStaticProps;
var getStaticPaths = function (_a) {
    var locales = _a.locales;
    var dirnames = fs_1.default.readdirSync(path_1.default.join("content", "news"));
    var paths = (0, mdxPageHelpers_1.getMDXPagePaths)(dirnames, locales);
    return {
        paths: paths,
        fallback: false,
    };
};
exports.getStaticPaths = getStaticPaths;
