"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalLinksSection = void 0;
var react_1 = require("react");
var image_1 = require("next/image");
var next_i18next_1 = require("next-i18next");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var material_1 = require("@mui/material");
var styles_1 = require("@mui/material/styles");
var react_query_1 = require("@tanstack/react-query");
var MuiStyledSidebarComponents_1 = require("features/sidebarSuite/common/MuiStyledSidebarComponents");
var PanelHeading_1 = require("features/sidebarSuite/common/PanelHeading");
var logo_bdrc_png_1 = require("public/assets/icons/logo_bdrc.png");
var logo_cbeta_png_1 = require("public/assets/icons/logo_cbeta.png");
var logo_dsbc_png_1 = require("public/assets/icons/logo_dsbc.png");
var logo_gretil_png_1 = require("public/assets/icons/logo_gretil.png");
var logo_rkts_png_1 = require("public/assets/icons/logo_rkts.png");
var logo_sc_png_1 = require("public/assets/icons/logo_sc.png");
var logo_vri_png_1 = require("public/assets/icons/logo_vri.png");
var dbApi_1 = require("utils/api/dbApi");
function CBCIcon(_a) {
    var fill = _a.fill;
    return (<div style={{
            border: "1px solid #aaa",
            borderRadius: "4px",
            overflow: "hidden",
            display: "inline-block",
            width: "48px",
            height: "32px",
        }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
        <text x="24" y="16" fontSize="16" fill={fill} textAnchor="middle" dominantBaseline="middle">
          CBC@
        </text>
      </svg>
    </div>);
}
var logos = {
    bdrc: logo_bdrc_png_1.default,
    cbeta: logo_cbeta_png_1.default,
    dsbc: logo_dsbc_png_1.default,
    gretil: logo_gretil_png_1.default,
    rkts: logo_rkts_png_1.default,
    suttacentral: logo_sc_png_1.default,
    vri: logo_vri_png_1.default,
};
// TODO: confirm this is exclusively used in DB file selection results pages and does not need to be refactored to be applied universally
var ExternalLinksSection = function () {
    var fileName = (0, useDbQueryParams_1.useDbQueryParams)().fileName;
    var t = (0, next_i18next_1.useTranslation)("settings").t;
    var theme = (0, styles_1.useTheme)();
    var data = (0, react_query_1.useQuery)({
        queryKey: [dbApi_1.DbApi.ExternalLinksData.makeQueryKey(fileName)],
        queryFn: function () { return dbApi_1.DbApi.ExternalLinksData.call({ fileName: fileName }); },
        refetchOnWindowFocus: false,
    }).data;
    // TODO: sort out dark theme icons, http://localhost:3000/db/tib/K01D0003_H0003/table
    if (data && Object.keys(data).length > 0) {
        return (<>
        <PanelHeading_1.default heading={t("headings.links")} sx={{ mt: 1 }}/>

        <material_1.List sx={{ display: "flex", justifyContent: "flex-start" }}>
          {Object.entries(data).map(function (_a) {
                var key = _a[0], value = _a[1];
                return value && (<material_1.ListItem key={key} sx={{ width: "inherit", pr: 0 }}>
                  <MuiStyledSidebarComponents_1.SourceLink href={value} target="_blank" rel="noopener noreferrer" title={key}>
                    {key === "cbc" ? (<CBCIcon fill={theme.palette.text.primary}/>) : (<image_1.default src={logos[key]} alt={"".concat(key, " logo")} height={32}/>)}
                  </MuiStyledSidebarComponents_1.SourceLink>
                </material_1.ListItem>);
            })}
        </material_1.List>
      </>);
    }
    return null;
};
exports.ExternalLinksSection = ExternalLinksSection;
