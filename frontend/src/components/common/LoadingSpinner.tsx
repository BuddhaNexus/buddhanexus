import { CenteredProgress } from "@components/layout/CenteredProgress";
import Paper from "@mui/material/Paper";

const LoadingSpinner = () => {
  return (
    <Paper
      sx={{
        display: "flex",
        alignItems: "center",
        flex: 1,
        width: "100%",
        height: "100%",
        py: 1,
        pl: 2,
        my: 1,
      }}
    >
      <CenteredProgress />
    </Paper>
  );
};

export default LoadingSpinner;
