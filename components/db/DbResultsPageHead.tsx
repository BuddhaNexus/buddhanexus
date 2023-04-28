import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getTextPath } from "@components/common/utils";
import CurrentResultChips from "@components/db/CurrentResultChips";
import { SourceTextSearchInput } from "@components/db/SourceTextSearchInput";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { currentDbViewAtom } from "features/sidebar/settingComponents/DbViewSelector";
import { isSidebarOpenAtom } from "features/sidebar/Sidebar";
import { useAtom, useAtomValue } from "jotai";

export const DbResultsPageHead = () => {
  const { t } = useTranslation("settings");
  const router = useRouter();

  // TODO: get full text name
  const { fileName, sourceLanguage } = useDbQueryParams();
  const dbView = useAtomValue(currentDbViewAtom);

  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);

  const handleSettingsClick = () => setIsSidebarOpen(!isSidebarOpen);

  const handleReset = async () => {
    await router.replace(
      {
        pathname: getTextPath({ sourceLanguage, fileName, dbView }),
        query: "",
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ pt: 2, pb: 3 }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CurrentResultChips />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            sx={{ p: 1, alignSelf: "flex-end" }}
            variant="text"
            size="small"
            onClick={handleReset}
          >
            {t(`resultsHead.reset`)}
          </Button>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleSettingsClick}
          >
            <TuneIcon color="action" />
          </IconButton>
        </Box>
      </Stack>
      <Typography variant="h2" component="h1">
        {fileName.toUpperCase()}
      </Typography>
      <SourceTextSearchInput />
    </>
  );
};
