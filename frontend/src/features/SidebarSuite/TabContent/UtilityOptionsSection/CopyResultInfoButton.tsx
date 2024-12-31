import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useResultPageType } from "@components/hooks/useResultPageType";
import {
  Popper,
  PopperMsgBox,
} from "@features/SidebarSuite/common/MuiStyledSidebarComponents";
import CopyIcon from "@mui/icons-material/CopyAllOutlined";
import {
  Fade,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { RESULT_PAGE_TITLE_GROUP_ID } from "@utils/constants";

export const CopyResultInfoButton = () => {
  const { t } = useTranslation("settings");

  const { resultPageType } = useResultPageType();

  const [popperAnchorEl, setPopperAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;

    let title = "";
    if (resultPageType === "dbFile") {
      title =
        document
          .getElementById(RESULT_PAGE_TITLE_GROUP_ID)
          ?.innerText.replaceAll(/\n+/g, "\n") ?? "";
    }

    const { href } = window.location;
    const text = `${title}\n${decodeURI(href)}`;
    await navigator.clipboard.writeText(text);
    setPopperAnchorEl((prev) => (prev ? null : target));
    setTimeout(() => setPopperAnchorEl(null), 1500);
  };

  const [isPopperOpen, setIsPopperOpen] = useState(false);

  React.useEffect(() => {
    setIsPopperOpen(Boolean(popperAnchorEl));
  }, [popperAnchorEl]);

  const popperId = isPopperOpen ? `copy-popper` : undefined;

  return (
    <ListItem disablePadding>
      <ListItemButton
        id="download-results-button"
        sx={{ px: 0 }}
        aria-describedby={popperId}
        onClick={handleClick}
      >
        <ListItemIcon>
          <CopyIcon />
        </ListItemIcon>
        <ListItemText primary={t(`optionsLabels.copyResultInfo`)} />
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
          <Fade {...TransitionProps} timeout={275}>
            <PopperMsgBox>{t(`optionsPopperMsgs.copied`)}</PopperMsgBox>
          </Fade>
        )}
      </Popper>
    </ListItem>
  );
};
