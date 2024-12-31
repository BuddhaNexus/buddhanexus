import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useResultPageType } from "@components/hooks/useResultPageType";
import {
  Popper,
  PopperMsgBox,
} from "@features/SidebarSuite/common/MuiStyledSidebarComponents";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import {
  Fade,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { RESULT_PAGE_TITLE_GROUP_ID } from "@utils/constants";

export const EmailResultInfoButton = () => {
  const { t } = useTranslation("settings");

  const { resultPageType } = useResultPageType();

  const [popperAnchorEl, setPopperAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const subject = t(`generic.resultsSubject`);
    let title = "";

    if (resultPageType === "dbFile") {
      title =
        document
          .getElementById(RESULT_PAGE_TITLE_GROUP_ID)
          ?.innerText.replaceAll(/\n+/g, "\n") ?? "";
    }

    const href = decodeURI(window.location.href);
    const text = `${title}\n${href}`;

    const link = document.createElement("a");
    link.href = `mailto:?subject=${subject}&body=${text}`;
    link.click();

    setPopperAnchorEl(popperAnchorEl ? null : event.currentTarget);

    link.remove();
  };

  const [isPopperOpen, setIsPopperOpen] = useState(false);

  React.useEffect(() => {
    setIsPopperOpen(Boolean(popperAnchorEl));
  }, [popperAnchorEl]);

  const popperId = isPopperOpen ? `copy-popper` : undefined;

  return (
    <ListItem disablePadding onMouseLeave={() => setPopperAnchorEl(null)}>
      <ListItemButton
        id="download-results-button"
        sx={{ px: 0 }}
        aria-describedby={popperId}
        onClick={handleClick}
      >
        <ListItemIcon>
          <EmailIcon />
        </ListItemIcon>
        <ListItemText primary={t(`optionsLabels.emailResultInfo`)} />
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
          <Fade {...TransitionProps} timeout={200}>
            <PopperMsgBox>
              {t(`optionsPopperMsgs.emailResultInfo`)}
            </PopperMsgBox>
          </Fade>
        )}
      </Popper>
    </ListItem>
  );
};
