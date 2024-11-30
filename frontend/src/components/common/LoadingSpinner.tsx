import Image from "next/image";
import { Box } from "@mui/material";
import dharmaWheelIcon from "public/assets/icons/dharmaWheel.svg";

import styles from "./loadingSpinner.module.scss";

interface Props {
  withBackground?: boolean;
  isLoading?: boolean;
}

const LoadingSpinner = ({ withBackground, isLoading }: Props) => {
  return (
    <Box
      className={`${styles.loadingSpinnerContainer} ${isLoading && styles.loadingSpinnerContainerLoading} ${withBackground && styles.loadingSpinnerContainerWithBackground}`}
    >
      <Image
        src={dharmaWheelIcon}
        alt="loading spinner"
        className={`${styles.loadingSpinner}`}
      />
    </Box>
  );
};

const InfiniteLoadingSpinner = () => <LoadingSpinner isLoading={true} />;

const InfiniteLoadingSpinnerWithBackground = () => (
  <LoadingSpinner isLoading={true} withBackground={true} />
);

export { InfiniteLoadingSpinner };

export default LoadingSpinner;
