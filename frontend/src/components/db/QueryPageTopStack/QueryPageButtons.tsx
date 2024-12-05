import * as React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, useMediaQuery } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import { useTheme } from "@mui/material/styles";

export const QueryPageButtons = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);
  const id = isPopoverOpen ? "simple-popover" : undefined;

  if (isSm) {
    return children;
  }

  return (
    <div>
      <IconButton aria-label="settings" size="large" onClick={handleClick}>
        <SettingsIcon />
      </IconButton>

      <Popover
        id={id}
        open={isPopoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        sx={{
          zIndex: 1000,
        }}
        onClose={handleClose}
      >
        <Box sx={{ p: 2 }}>{children}</Box>
      </Popover>
    </div>
  );
};
