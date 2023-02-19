import CurrentResultChips from "@components/db/CurrentResultChips";
import { DbViewSelector } from "@components/db/DbViewSelector";
import { SourceTextSearchInput } from "@components/db/SourceTextSearchInput";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { sidebarIsOpenAtom } from "features/sidebar/Sidebar";
import { useAtom } from "jotai";

export const DbResultsPageHead = () => {
  // TODO: get full text name
  const { fileName } = useDbQueryParams();

  const [sidebarIsOpen, setSidebarIsOpen] = useAtom(sidebarIsOpenAtom);

  const handleFilterClick = () => setSidebarIsOpen(!sidebarIsOpen);

  return (
    <>
      <Typography variant="h2" component="h1">
        {fileName.toUpperCase()}
      </Typography>
      <SourceTextSearchInput />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ py: 1 }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <DbViewSelector currentView="numbers" />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CurrentResultChips />

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleFilterClick}
          >
            <SettingsIcon color="action" />
          </IconButton>
        </Box>
      </Stack>
    </>
  );
};
