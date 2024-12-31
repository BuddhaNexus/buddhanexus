import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { useStandardViewBaseQueryParams } from "@components/hooks/groupedQueryParams";
import { useSortMethodParam } from "@components/hooks/params";
import {
  Popper,
  PopperMsgBox,
} from "@features/SidebarSuite/common/MuiStyledSidebarComponents";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Fade,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { DbApi } from "@utils/api/dbApi";
import type { APISchemas } from "@utils/api/types";
import { isValidDownloadView } from "@utils/validators";
import { useAtomValue } from "jotai";

function createDownload(blob: Blob, view: string, name: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `BuddhaNexus_${view}_results__${name}__${new Date()
    .toISOString()
    .replace(/\.\w+$/, "")
    .replaceAll(":", "")}.xlsx`;
  document.body.append(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

const Button = ({ view }: { view: APISchemas["DownloadData"] }) => {
  const { t } = useTranslation(["settings", "common"]);

  const requestBodyBase = useStandardViewBaseQueryParams();
  const [sort_method] = useSortMethodParam();

  const [popperAnchorEl, setPopperAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const [message, setMessage] = useState("");

  React.useEffect(() => {
    setIsPopperOpen(Boolean(popperAnchorEl));
  }, [popperAnchorEl]);

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;

    setMessage(t(`optionsPopperMsgs.downloadStarted`));
    setPopperAnchorEl(target);
    setTimeout(() => setPopperAnchorEl(null), 3000);

    const { blob, error } = await DbApi.DownloadResults.call({
      ...requestBodyBase,
      sort_method,
      page: 0,
      download_data: view,
    });

    if (error) {
      setMessage(t(`optionsPopperMsgs.downloadError`));
      setPopperAnchorEl(target);
      setTimeout(() => setPopperAnchorEl(null), 3000);
      return;
    }

    createDownload(blob, view, requestBodyBase.filename);
  };

  const popperId = isPopperOpen ? `download-popper` : undefined;

  return (
    <ListItem disablePadding>
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

      <Popper
        id={popperId}
        open={isPopperOpen}
        anchorEl={popperAnchorEl}
        placement="top"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 20],
            },
          },
        ]}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <PopperMsgBox>{message}</PopperMsgBox>
          </Fade>
        )}
      </Popper>
    </ListItem>
  );
};

export const DownloadResultsButton = () => {
  const currentView = useAtomValue(currentDbViewAtom);

  if (!isValidDownloadView(currentView)) {
    return null;
  }

  return <Button view={currentView} />;
};
