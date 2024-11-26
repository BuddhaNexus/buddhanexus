import Image from "next/image";
import Paper from "@mui/material/Paper";
import dharmaWheelIcon from "public/assets/icons/dharmaWheel.svg";

import styles from "./loadingSpinner.module.scss";

interface Props {
  withBackground?: boolean;
}

const LoadingSpinner = ({ withBackground }: Props) => {
  return (
    <Paper
      sx={
        withBackground
          ? {
              display: "flex",
              alignItems: "center",
              flex: 1,
              width: "100%",
              height: "100%",
              py: 1,
              pl: 2,
              my: 1,
            }
          : undefined
      }
    >
      <Image
        src={dharmaWheelIcon}
        alt="loading spinner"
        className={styles.loadingSpinner}
      />
    </Paper>
  );
};

export default LoadingSpinner;
