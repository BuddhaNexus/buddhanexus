import React from "react";
import PercentIcon from "@mui/icons-material/Percent";
import { Box, Card, CardContent, Chip, Divider, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

const Placeholder = styled(Box)(() => ({
  height: "5rem",
  width: "100%",
}));

export const SearchResultSkeletonItem = () => {
  return (
    <Card sx={{ flex: 1, wordBreak: "break-all" }}>
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          bgcolor: "background.card",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: { xs: "start", sm: "end" },
            alignItems: "center",
          }}
        >
          <Tooltip title="Score" PopperProps={{ disablePortal: true }}>
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              icon={<PercentIcon />}
              label="0"
              sx={{ mr: 0.5, my: 0.5, p: 0.5 }}
            />
          </Tooltip>

          <Chip size="small" label={`Length: ${0}`} sx={{ m: 0.5, p: 0.5 }} />
        </Box>
      </CardContent>

      <Divider />

      <CardContent>
        <Placeholder />
      </CardContent>
    </Card>
  );
};
