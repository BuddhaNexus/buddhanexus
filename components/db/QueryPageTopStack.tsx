import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getTextPath } from "@components/common/utils";
import CurrentResultChips from "@components/db/CurrentResultChips";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { isSidebarOpenAtom } from "features/sidebarSuite/SidebarSuite";
import { useAtom, useAtomValue } from "jotai";

/**
 * Renders a Stack UI component for the top of query pages with query
 * info chips, a reset button and a sidebar toggle. Applicable to:
 * - db view pages
 * - search page
 *
 */
export const QueryPageTopStack = () => {
  const { t } = useTranslation("settings");
  const router = useRouter();

  const { fileName, sourceLanguage } = useDbQueryParams();
  const dbView = useAtomValue(currentViewAtom);

  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);

  const handleReset = async () => {
    const isSearchRoute = router.route.startsWith("/search");

    const pathname = isSearchRoute
      ? "/search"
      : getTextPath({ sourceLanguage, fileName, dbView });
    await router.push(
      {
        pathname,
        query: "",
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  return (
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
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <TuneIcon color="action" />
        </IconButton>
      </Box>
    </Stack>
  );
};
