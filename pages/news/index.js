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
exports.getStaticProps = void 0;
var next_i18next_1 = require("next-i18next");
var Link_1 = require("@components/common/Link");
var Footer_1 = require("@components/layout/Footer");
var PageContainer_1 = require("@components/layout/PageContainer");
var material_1 = require("@mui/material");
var Box_1 = require("@mui/material/Box");
var List_1 = require("@mui/material/List");
var ListItem_1 = require("@mui/material/ListItem");
var mdxPageHelpers_1 = require("utils/mdxPageHelpers");
var nextJsHelpers_1 = require("utils/nextJsHelpers");
var PostArchive = function (_a) {
    var locale = _a.locale, posts = _a.posts;
    var t = (0, next_i18next_1.useTranslation)().t;
    return (<Box_1.default width="100%">
      <List_1.default>
        {posts.map(function (post) {
            var _a = post.meta, title = _a.title, date = _a.date, description = _a.description;
            var path = "/news/".concat(post.slug);
            var jsData = new Date(date);
            var pubDate = jsData.toLocaleDateString(locale, mdxPageHelpers_1.POST_DATE_OPTS);
            return (<ListItem_1.default key={post.slug} sx={{ mb: 5 }} disablePadding>
              <article style={{ width: "100%" }}>
                <material_1.Typography variant="h4" component="h2">
                  <Link_1.Link href={path}>{title}</Link_1.Link>
                </material_1.Typography>
                <material_1.Typography variant="subtitle1" component="p">
                  {pubDate}
                </material_1.Typography>
                <material_1.Typography variant="body1">{description}</material_1.Typography>

                <Link_1.Link href={path}>
                  <material_1.Typography variant="body1" display="flex" alignItems="center">
                    {t("common:news.readMore")}
                  </material_1.Typography>
                </Link_1.Link>
              </article>
            </ListItem_1.default>);
        })}
      </List_1.default>
    </Box_1.default>);
};
function NewsPage(_a) {
    var locale = _a.locale, allPosts = _a.allPosts;
    var t = (0, next_i18next_1.useTranslation)().t;
    return (<PageContainer_1.PageContainer>
      <material_1.Paper elevation={1} sx={{ py: 3, px: 4 }}>
        <material_1.Typography variant="h1" component="h1" mb={3}>
          {t("common:news.title")}
        </material_1.Typography>
        <PostArchive posts={allPosts} locale={locale}/>
      </material_1.Paper>
      <Footer_1.Footer />
    </PageContainer_1.PageContainer>);
}
exports.default = NewsPage;
var getStaticProps = function (_a) {
    var locale = _a.locale;
    return __awaiter(void 0, void 0, void 0, function () {
        var i18nProps, allPosts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, nextJsHelpers_1.getI18NextStaticProps)({
                        locale: locale,
                    }, ["common"])];
                case 1:
                    i18nProps = _b.sent();
                    allPosts = (0, mdxPageHelpers_1.getAllPosts)(["content", "news"], locale);
                    return [2 /*return*/, {
                            props: __assign({ allPosts: allPosts, locale: locale }, i18nProps.props),
                        }];
            }
        });
    });
};
exports.getStaticProps = getStaticProps;
