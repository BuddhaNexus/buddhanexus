import React, { useState } from "react";
import useDownloader from "react-use-downloader";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { useStandardViewBaseQueryParams } from "@components/hooks/groupedQueryParams";
import { useSortMethodParam } from "@components/hooks/params";
import { useResultPageType } from "@components/hooks/useResultPageType";
import {
  Popper,
  PopperMsgBox,
} from "@features/SidebarSuite/common/MuiStyledSidebarComponents";
// import { DbApi } from "@utils/api/dbApi";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Fade,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useAtomValue } from "jotai";

export const DownloadResultsButton = () => {
  const { t } = useTranslation(["settings", "common"]);

  const currentView = useAtomValue(currentDbViewAtom);
  const requestBodyBase = useStandardViewBaseQueryParams();
  const [sort_method] = useSortMethodParam();

  const { download, error } = useDownloader();
  //----
  const [popperAnchorEl, setPopperAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    // DbApi.DownloadResults.call({
    //   ...requestBodyBase,
    //   sort_method,
    //   page: 0,
    //   download_data: currentView,
    // });
    setPopperAnchorEl(popperAnchorEl ? null : event.currentTarget);
  };

  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const showPopper = Boolean(error);
  const popperId = isPopperOpen ? `download-popper` : undefined;

  return (
    <ListItem disablePadding onMouseLeave={() => setIsPopperOpen(false)}>
      <ListItemButton
        id="download-results-button"
        sx={{ px: 0 }}
        aria-describedby={popperId}
        onClick={handleClick}
      >
        <ListItemIcon>
          <FileDownloadIcon />
        </ListItemIcon>
        <ListItemText primary={t(`optionsLabels.download_data`)} />
      </ListItemButton>

      {showPopper && (
        <Popper
          id={popperId}
          open={isPopperOpen}
          anchorEl={popperAnchorEl}
          placement="top"
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <PopperMsgBox>
                {t(`optionsPopperMsgs.download_data`)}
              </PopperMsgBox>
            </Fade>
          )}
        </Popper>
      )}
    </ListItem>
  );
};
