import { memo } from "react";
import { Tree } from "react-arborist";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  BrowserNode,
  SelectorNode,
} from "@components/db/SourceTextTree/TreeNodeComponents";
import type { SourceTextTreeNode } from "@components/db/SourceTextTree/types";
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
import type { PrimitiveAtom } from "jotai";
import { SourceLanguage } from "utils/constants";

type TreeViewBrowserContentProps = {
  data: SourceTextTreeNode[];
  height: number;
  width: number;
  searchTerm?: string;
};

export type TreeViewSelectProps = {
  selectedItemsAtom: PrimitiveAtom<SourceTextTreeNode[]>;
};

type TreeViewContentProps =
  | ({ type: "browse" } & TreeViewBrowserContentProps)
  | ({ type: "select" } & TreeViewBrowserContentProps & TreeViewSelectProps);

// https://github.com/brimdata/react-arborist
const TreeViewBrowserContent = memo(function TreeViewBrowserContent({
  data,
  height,
  width,
  searchTerm,
}: TreeViewBrowserContentProps) {
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
      {BrowserNode}
    </Tree>
  );
});

const TreeViewSelectorContent = memo(function TreeViewSelectorContent({
  data,
  height,
  width,
  searchTerm,
  selectedItemsAtom,
}: TreeViewBrowserContentProps & TreeViewSelectProps) {
  const router = useRouter();

  return (
    <Tree
      key={router.asPath}
      searchTerm={searchTerm}
      initialData={data}
      openByDefault={false}
      disableDrag={true}
      rowHeight={46}
      disableDrop={true}
      disableEdit={true}
      disableMultiSelection={false}
      padding={12}
      height={height}
      width={width}
      indent={16}
    >
      {(props) => (
        <SelectorNode {...props} selectedItemsAtom={selectedItemsAtom} />
      )}
    </Tree>
  );
});

export type TreeViewContentType = "browse" | "select";

export function TreeViewContent(props: TreeViewContentProps) {
  const { type, data, height, width, searchTerm } = props;

  if (type === "select") {
    return (
      <TreeViewSelectorContent
        data={data}
        height={height}
        width={width}
        searchTerm={searchTerm}
        selectedItemsAtom={props.selectedItemsAtom}
      />
    );
  }

  return (
    <TreeViewBrowserContent
      data={data}
      height={height}
      width={width}
      searchTerm={searchTerm}
    />
  );
}

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

type InactiveTreeHeadProps = {
  hasHeading: boolean;
  sourceLanguage: SourceLanguage;
  px?: number;
};

function InactiveTreeHead({
  hasHeading,
  sourceLanguage,
  px,
}: InactiveTreeHeadProps) {
  return (
    <>
      <TreeHeading isRendered={hasHeading} sourceLanguage={sourceLanguage} />
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

export function LoadingTree(props: InactiveTreeHeadProps) {
  return (
    <>
      <InactiveTreeHead {...props} />

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
} & InactiveTreeHeadProps;

export function TreeException(props: TreeExceptionProps) {
  return (
    <>
      <InactiveTreeHead {...props} />

      <Typography sx={{ mt: 4 }} color="error.main">
        {props.message}
      </Typography>
    </>
  );
}
