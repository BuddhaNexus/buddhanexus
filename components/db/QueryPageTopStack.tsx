import * as React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getTextPath } from "@components/common/utils";
import CurrentResultChips from "@components/db/CurrentResultChips";
import { SourceTextSearchInput } from "@components/db/SourceTextSearchInput";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import RotateLeftOutlinedIcon from "@mui/icons-material/RotateLeftOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Button, Modal, Stack } from "@mui/material";
import { useAtomValue } from "jotai";

const modalBoxstyles = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "clamp(300px, 90%, 900px)",
  height: "500px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

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
  const isSearchRoute = router.route.startsWith("/search");

  const { fileName, sourceLanguage } = useDbQueryParams();
  const dbView = useAtomValue(currentViewAtom);

  const { isSettingsOpen, setIsSettingsOpen } = useSettingsDrawer();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleReset = async () => {
    const pathname = isSearchRoute
      ? "/search"
      : getTextPath({ sourceLanguage, fileName, dbView });
    await router.push(
      {
        pathname,
        query: {},
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
      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}
      >
        <Button
          variant="outlined"
          aria-label={t(`resultsHead.settingsTip`)}
          title={t(`resultsHead.settingsTip`)}
          startIcon={<TuneIcon />}
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          {t(`resultsHead.settings`)}
        </Button>
        <Button
          variant="outlined"
          aria-label={t(`resultsHead.resetTip`)}
          title={t(`resultsHead.resetTip`)}
          startIcon={<RotateLeftOutlinedIcon />}
          onClick={handleReset}
        >
          {t(`resultsHead.reset`)}
        </Button>
        {!isSearchRoute && (
          <>
            <Button
              variant="outlined"
              aria-label={t(`resultsHead.textSelectTip`)}
              title={t(`resultsHead.textSelectTip`)}
              startIcon={<GradingOutlinedIcon />}
              onClick={handleOpen}
            >
              {t(`resultsHead.textSelect`)}
            </Button>
            <Modal
              open={open}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              sx={{
                backdropFilter: "blur(3px)",
                bgcolor: "rgba(255, 255, 255, 0.1)",
              }}
              onClose={handleClose}
            >
              <Box sx={modalBoxstyles}>
                {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                <SourceTextSearchInput autoFocus={true} />
              </Box>
            </Modal>
          </>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <CurrentResultChips />
      </Box>
    </Stack>
  );
};
