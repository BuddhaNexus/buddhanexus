"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarSuite = exports.StandinSetting = exports.isSidebarOpenAtom = void 0;
var react_1 = require("react");
var router_1 = require("next/router");
var CloseRounded_1 = require("@mui/icons-material/CloseRounded");
var lab_1 = require("@mui/lab/");
var material_1 = require("@mui/material");
var jotai_1 = require("jotai");
var MuiStyledSidebarComponents_1 = require("./common/MuiStyledSidebarComponents");
var SidebarTabs_1 = require("./SidebarTabs");
exports.isSidebarOpenAtom = (0, jotai_1.atom)(true);
// TODO: remove once full settings suit is complete
var StandinSetting = function (setting) { return (<div>
    <small>{setting} setting coming to a sidebar near your soon!</small>
  </div>); };
exports.StandinSetting = StandinSetting;
function SidebarSuite() {
    var router = (0, router_1.useRouter)();
    var _a = (0, jotai_1.useAtom)(exports.isSidebarOpenAtom), isSidebarOpen = _a[0], setIsSidebarOpen = _a[1];
    var _b = (0, react_1.useState)("0"), activeTab = _b[0], setActiveTab = _b[1];
    var isSearchRoute = router.route.startsWith("/search");
    var handleTabChange = (0, react_1.useCallback)(function (event, newValue) {
        setActiveTab(newValue);
    }, [setActiveTab]);
    return (<material_1.Drawer sx={{
            width: MuiStyledSidebarComponents_1.SETTINGS_DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
                width: MuiStyledSidebarComponents_1.SETTINGS_DRAWER_WIDTH,
            },
        }} variant="persistent" anchor="right" open={isSidebarOpen}>
      <material_1.Toolbar />
      <aside>
        <material_1.Box sx={{ width: 1 }}>
          <lab_1.TabContext value={activeTab}>
            <MuiStyledSidebarComponents_1.DrawerHeader>
              <material_1.Box sx={{ width: 1, borderBottom: 1, borderColor: "divider" }}>
                <SidebarTabs_1.SidebarTabList isSearchRoute={isSearchRoute} onTabChange={handleTabChange}/>
              </material_1.Box>

              <material_1.IconButton onClick={function () { return setIsSidebarOpen(false); }}>
                <CloseRounded_1.default />
              </material_1.IconButton>
            </MuiStyledSidebarComponents_1.DrawerHeader>

            {isSearchRoute ? (<SidebarTabs_1.SearchPageSidebarTabPanels />) : (<SidebarTabs_1.DbFilePageSidebarTabPanels />)}
          </lab_1.TabContext>
        </material_1.Box>
      </aside>
    </material_1.Drawer>);
}
exports.SidebarSuite = SidebarSuite;
