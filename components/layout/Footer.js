"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Footer = void 0;
var react_1 = require("react");
var router_1 = require("next/router");
var next_i18next_1 = require("next-i18next");
var Link_1 = require("@components/common/Link");
var Container_1 = require("@mui/material/Container");
var Grid_1 = require("@mui/material/Grid");
var Typography_1 = require("@mui/material/Typography");
var Copyright_1 = require("./Copyright");
var getFooterData = function (t) { return [
    {
        title: t("footer.about"),
        links: [
            { title: t("footer.introduction"), slug: "/introduction" },
            { title: t("footer.history"), slug: "/history" },
            { title: t("footer.guidelines"), slug: "/guidelines" },
            { title: t("footer.contact"), slug: "/contact" },
        ],
    },
    {
        title: t("footer.community"),
        links: [
            { title: t("footer.institutions"), slug: "/institutions" },
            { title: t("footer.people"), slug: "/people" },
            { title: t("footer.news"), slug: "/news" },
        ],
    },
    {
        title: t("footer.activities"),
        links: [
            { title: t("footer.publications"), slug: "/publications" },
            { title: t("footer.events"), slug: "/events" },
            { title: t("footer.projects"), slug: "/projects" },
            { title: t("footer.presentations"), slug: "/presentations" },
        ],
    },
]; };
var Footer = function () {
    var t = (0, next_i18next_1.useTranslation)().t;
    var router = (0, router_1.useRouter)();
    var locale = router.locale;
    var footerData = (0, react_1.useMemo)(function () { return getFooterData(t, locale); }, [t, locale]);
    return (<Container_1.default maxWidth="md" component="footer" sx={{
            py: [4, 6],
            justifyContent: "flex-end",
            flexDirection: "column",
            display: "flex",
            flex: 1,
        }}>
      <Grid_1.default justifyContent="space-evenly" rowSpacing={4} sx={{
            borderTop: function (theme) { return "1px solid ".concat(theme.palette.divider); },
            textAlign: {
                xs: "center",
                sm: "unset",
            },
        }} container>
        {footerData.map(function (footer) { return (<Grid_1.default key={footer.title} xs={12} sm="auto" item>
            <Typography_1.default variant="h6" color="text.primary" gutterBottom>
              {footer.title}
            </Typography_1.default>
            <Container_1.default component="ul" sx={{ listStyleType: "none", paddingLeft: { sm: 0 } }}>
              {footer.links.map(function (item) { return (<Container_1.default key={item.title} component="li" sx={{ mt: { xs: 1 } }}>
                  <Link_1.Link href={item.slug}>{item.title}</Link_1.Link>
                </Container_1.default>); })}
            </Container_1.default>
          </Grid_1.default>); })}
      </Grid_1.default>
      <Copyright_1.Copyright sx={{ mt: 5 }}/>
    </Container_1.default>);
};
exports.Footer = Footer;
