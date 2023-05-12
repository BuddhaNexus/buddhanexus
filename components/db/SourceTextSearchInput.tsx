/**
 * https://mui.com/material-ui/react-autocomplete/
 * https://codesandbox.io/s/2326jk?file=/demo.tsx
 */

import React from "react";
import type { ListChildComponentProps } from "react-window";
import { VariableSizeList } from "react-window";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getTextPath } from "@components/common/utils";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
import {
  Autocomplete,
  autocompleteClasses,
  Box,
  CircularProgress,
  ListSubheader,
  Popper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/styles";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { DbApi } from "utils/api/dbApi";
import type { DatabaseText } from "utils/api/textLists";

const OuterElementContext = React.createContext({});

// eslint-disable-next-line react/display-name
const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    // eslint-disable-next-line eqeqeq,no-eq-null
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// px
const LISTBOX_PADDING = 8;

const Row = (props: ListChildComponentProps) => {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
    fontWeight: 700,
  };

  // eslint-disable-next-line no-prototype-builtins
  if (dataSet.hasOwnProperty("group")) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  const [dataSetProps, { name, textName }] = dataSet;

  return (
    <Box
      {...dataSetProps}
      style={inlineStyle}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flex: 1,
        "&:nth-of-type(even)": { bgcolor: "background.accent" },
        "&:hover": { textDecoration: "underline" },
      }}
      component="li"
    >
      <Typography
        component="option"
        sx={{
          flex: 1,
          whiteSpace: "normal",
        }}
      >
        {name}
      </Typography>
      <Typography
        component="small"
        variant="subtitle2"
        {...dataSetProps}
        sx={{ textTransform: "uppercase", fontSize: 12, whiteSpace: "normal" }}
      >
        {textName}
      </Typography>
    </Box>
  );
};

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: React.ReactChild[] = [];
  // eslint-disable-next-line unicorn/no-array-for-each
  (children as React.ReactChild[]).forEach(
    (item: React.ReactChild & { children?: React.ReactChild[] }) => {
      itemData.push(item, ...(item.children ?? []));
    }
  );

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child: React.ReactChild) => {
    // eslint-disable-next-line no-prototype-builtins
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    const charsInLine = smUp ? 80 : 40;
    // @ts-expect-error type issue
    const lineCount = Math.ceil(child[1].name.length / charsInLine);
    return itemSize * lineCount;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 10 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          ref={gridRef}
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index: number) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {Row}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

export const SourceTextSearchInput = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { sourceLanguage, queryParams } = useDbQueryParams();
  const dbView = useAtomValue(currentViewAtom);

  const { data, isLoading } = useQuery<DatabaseText[]>({
    queryKey: DbApi.LanguageMenu.makeQueryKey(sourceLanguage),
    queryFn: () => DbApi.LanguageMenu.call(sourceLanguage),
  });

  // TODO: Add pagination and fuzzy search on BE
  return (
    <Autocomplete<DatabaseText>
      sx={{ my: 1 }}
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      options={data ?? []}
      groupBy={(option) => option.category.toUpperCase()}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("db.searchInputPlaceholder")}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => [props, option] as React.ReactNode}
      renderGroup={(params) => params as unknown as React.ReactNode}
      loading={isLoading}
      disableListWrap
      disablePortal
      onChange={(target, value) =>
        router.push({
          pathname: getTextPath({
            sourceLanguage,
            fileName: value?.fileName,
            dbView,
          }),
          //  TODO: per previous spec descision, confirm whether query params should persist accross file changes, or should be reset on file change. Remove `query` prop for reset.
          query: queryParams,
        })
      }
    />
  );
};
