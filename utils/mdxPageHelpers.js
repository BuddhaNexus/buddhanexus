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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMDXPagePaths = exports.getMDXPageComponents = exports.getAllPosts = exports.getMDXContentBySlug = exports.POST_DATE_OPTS = void 0;
var fs_1 = require("fs");
var gray_matter_1 = require("gray-matter");
var path_1 = require("path");
var mdxPageImports_1 = require("./mdxPageImports");
exports.POST_DATE_OPTS = {
    year: "numeric",
    month: "long",
    day: "numeric",
};
function getMDXContentBySlug(pathBase, slug, locale) {
    if (locale === void 0) { locale = "en"; }
    var itemPath = path_1.default.join("".concat(pathBase, "/").concat(slug, "/").concat(locale, ".mdx"));
    var fileContents = fs_1.default.readFileSync(itemPath, "utf8");
    var _a = (0, gray_matter_1.default)(fileContents), content = _a.content, data = _a.data;
    var meta = data;
    return { slug: slug, meta: meta, content: content };
}
exports.getMDXContentBySlug = getMDXContentBySlug;
function getAllPosts(pathBaseItems, lang) {
    var slugs = fs_1.default.readdirSync(path_1.default.join.apply(path_1.default, pathBaseItems));
    var posts = slugs
        .map(function (slug) { return getMDXContentBySlug(pathBaseItems.join("/"), slug, lang); })
        .sort(function (post1, post2) { return (post1.meta.date > post2.meta.date ? -1 : 1); });
    return posts;
}
exports.getAllPosts = getAllPosts;
function getMDXPageComponents(_a) {
    var componentList = _a.componentList, propsList = _a.propsList, importsList = _a.importsList;
    var components = {};
    if (componentList) {
        for (var _i = 0, componentList_1 = componentList; _i < componentList_1.length; _i++) {
            var component = componentList_1[_i];
            components[component] = mdxPageImports_1.MDX_COMPONENTS[component];
        }
    }
    var props = {};
    if (propsList) {
        for (var _b = 0, propsList_1 = propsList; _b < propsList_1.length; _b++) {
            var prop = propsList_1[_b];
            props[prop] = mdxPageImports_1.MDX_PROPS[prop];
        }
    }
    var imports = {};
    if (importsList) {
        for (var _c = 0, importsList_1 = importsList; _c < importsList_1.length; _c++) {
            var item = importsList_1[_c];
            imports[item] = mdxPageImports_1.MDX_IMPORTS[item];
        }
    }
    return { components: components, props: __assign(__assign({}, props), imports) };
}
exports.getMDXPageComponents = getMDXPageComponents;
function getMDXPagePaths(dirnames, locales) {
    var paths = [];
    for (var _i = 0, dirnames_1 = dirnames; _i < dirnames_1.length; _i++) {
        var dir = dirnames_1[_i];
        for (var _a = 0, locales_1 = locales; _a < locales_1.length; _a++) {
            var locale = locales_1[_a];
            paths.push({ params: { slug: dir }, locale: locale });
        }
    }
    return paths;
}
exports.getMDXPagePaths = getMDXPagePaths;
