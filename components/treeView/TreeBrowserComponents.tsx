import { memo } from "react";
import { Tree } from "react-arborist";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Node } from "@components/treeView/TreeNodeComponents";
import type { DrawerNavigationNodeData } from "@components/treeView/types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  FormControl,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { SourceLanguage } from "utils/constants";

// https://github.com/brimdata/react-arborist
export const TreeViewContent = memo(function TreeViewContent({
  data,
  height,
  width,
  searchTerm,
}: {
  data: DrawerNavigationNodeData[];
  height: number;
  width: number;
  searchTerm?: string;
}) {
  const router = useRouter();

  return (
    <Tree
      key={router.asPath}
      searchTerm={searchTerm}
      initialData={data}
      openByDefault={false}
      disableDrag={true}
      rowHeight={68}
      disableDrop={true}
      disableEdit={true}
      padding={12}
      height={height}
      width={width}
    >
      {Node}
    </Tree>
  );
});

type HeadingProps = {
  isRendered: boolean;
  sourceLanguage: SourceLanguage;
};

export function TreeHeading({ isRendered, sourceLanguage }: HeadingProps) {
  const { t } = useTranslation(["common"]);
  if (!isRendered) return null;

  const languageName = t(`language.${sourceLanguage}`);
  return (
    <Typography variant="h5" component="h2" sx={{ px: 2, py: 2 }}>
      {t("textBrowser.mainPrompt", { languageName })}
    </Typography>
  );
}

type StaticTreeHeadProps = {
  renderHeading: boolean;
  sourceLanguage: SourceLanguage;
  px?: number;
};

function StaticTreeHead({
  renderHeading,
  sourceLanguage,
  px,
}: StaticTreeHeadProps) {
  return (
    <>
      <TreeHeading isRendered={renderHeading} sourceLanguage={sourceLanguage} />
      <FormControl variant="outlined" sx={{ px, pt: 2, pb: 0 }} fullWidth>
        <TextField
          label="Search"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          disabled
        />
      </FormControl>
    </>
  );
}

export function LoadingTree(props: StaticTreeHeadProps) {
  return (
    <>
      <StaticTreeHead {...props} />

      <Box sx={{ mt: 4 }}>
        {[6, 4, 3, 5, 4].map((n, i) => (
          <Box
            key={`tree-skeleton-${i}`}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              maxWidth: `${n * 10}%`,
            }}
          >
            <ChevronRightIcon sx={{ mr: 1 }} />
            <Skeleton
              sx={{
                flexGrow: 1,
                animationDuration: `4s`,
                "&::after": { animationDuration: `2.${n}s` },
              }}
            />
          </Box>
        ))}
      </Box>
    </>
  );
}

type TreeExceptionProps = {
  message: string;
} & StaticTreeHeadProps;

export function TreeException(props: TreeExceptionProps) {
  return (
    <>
      <StaticTreeHead {...props} />

      <Typography sx={{ mt: 4 }} color="error.main">
        {props.message}
      </Typography>
    </>
  );
}
