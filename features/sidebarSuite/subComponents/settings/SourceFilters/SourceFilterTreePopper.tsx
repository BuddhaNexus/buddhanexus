import React from "react";
import useDimensions from "react-cool-dimensions";
import { SourceTextTree } from "@components/db/SourceTextTree";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Box, Popper } from "@mui/material";

type SourceFilterTreePopperProps = {
  popperId: string | undefined;
  open: boolean;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  selectedItemsAtom: any;
};

const SourceFilterTreePopper = ({
  popperId,
  open,
  anchorEl,
  handleClose,
  selectedItemsAtom,
}: SourceFilterTreePopperProps) => {
  const { observe, height, width } = useDimensions();

  return (
    <Popper
      id={popperId}
      open={open}
      anchorEl={anchorEl}
      sx={{
        zIndex: 1200,
        maxHeight: "424px",
        width: "100%",
        maxWidth: "340px",
        overflow: "clip",
        boxShadow: 3,
        borderRadius: 1,
        bgcolor: "background.paper",
      }}
      placement="top"
    >
      <ClickAwayListener onClickAway={handleClose}>
        <Box
          ref={observe}
          sx={{
            p: 1,
            minHeight: 400,
            width: "100%",
          }}
        >
          <SourceTextTree
            type="select"
            selectedItemsAtom={selectedItemsAtom}
            parentHeight={height}
            parentWidth={width}
            hasHeading={false}
            px={0}
          />
        </Box>
      </ClickAwayListener>
    </Popper>
  );
};

export default SourceFilterTreePopper;
