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
exports.QueryPageTopStack = void 0;
var router_1 = require("next/router");
var next_i18next_1 = require("next-i18next");
var utils_1 = require("@components/common/utils");
var CurrentResultChips_1 = require("@components/db/CurrentResultChips");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var useDbView_1 = require("@components/hooks/useDbView");
var Tune_1 = require("@mui/icons-material/Tune");
var material_1 = require("@mui/material");
var SidebarSuite_1 = require("features/sidebarSuite/SidebarSuite");
var jotai_1 = require("jotai");
/**
 * Renders a Stack UI component for the top of query pages with query
 * info chips, a reset button and a sidebar toggle. Applicable to:
 * - db view pages
 * - search page
 *
 */
var QueryPageTopStack = function () {
    var t = (0, next_i18next_1.useTranslation)("settings").t;
    var router = (0, router_1.useRouter)();
    var _a = (0, useDbQueryParams_1.useDbQueryParams)(), fileName = _a.fileName, sourceLanguage = _a.sourceLanguage;
    var dbView = (0, jotai_1.useAtomValue)(useDbView_1.currentViewAtom);
    var _b = (0, jotai_1.useAtom)(SidebarSuite_1.isSidebarOpenAtom), isSidebarOpen = _b[0], setIsSidebarOpen = _b[1];
    var handleReset = function () { return __awaiter(void 0, void 0, void 0, function () {
        var isSearchRoute, pathname;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isSearchRoute = router.route.startsWith("/search");
                    pathname = isSearchRoute
                        ? "/search"
                        : (0, utils_1.getTextPath)({ sourceLanguage: sourceLanguage, fileName: fileName, dbView: dbView });
                    return [4 /*yield*/, router.push({
                            pathname: pathname,
                            query: "",
                        }, undefined, {
                            shallow: true,
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<material_1.Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ pt: 2, pb: 3 }}>
      <material_1.Box sx={{ display: "flex", alignItems: "center" }}>
        <CurrentResultChips_1.default />
      </material_1.Box>

      <material_1.Box sx={{ display: "flex", alignItems: "center" }}>
        <material_1.Button sx={{ p: 1, alignSelf: "flex-end" }} variant="text" size="small" onClick={handleReset}>
          {t("resultsHead.reset")}
        </material_1.Button>
        <material_1.IconButton color="inherit" aria-label="open drawer" edge="end" onClick={function () { return setIsSidebarOpen(!isSidebarOpen); }}>
          <Tune_1.default color="action"/>
        </material_1.IconButton>
      </material_1.Box>
    </material_1.Stack>);
};
exports.QueryPageTopStack = QueryPageTopStack;
