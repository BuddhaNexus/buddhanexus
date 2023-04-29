import React, { useEffect, useState } from "react";
import { type ListChildComponentProps, VariableSizeList } from "react-window";
import { useTranslation } from "next-i18next";
import { useTextLists } from "@components/hooks/useTextLists";
import {
  Autocomplete,
  autocompleteClasses,
  Box,
  CircularProgress,
  ListSubheader,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/styles";
import { ArrayParam, useQueryParam } from "use-query-params";
import type { CategoryMenuItem } from "utils/api/textLists";
import { DEFAULT_QUERY_PARAMS } from "utils/dbUISettings";

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

  const [dataSetProps, { name, ref }] = dataSet;
  return (
    <Box
      {...dataSetProps}
      style={inlineStyle}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flex: 1,
        "&:nth-of-type(even)": {
          bgcolor: "background.accent",
        },
        "&:hover": { textDecoration: "underline" },
      }}
      component="li"
    >
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          padding: "4px 0",
        }}
      >
        <Typography
          sx={{
            display: "inline",
            whiteSpace: "normal",
            wordBreak: "break-all",
          }}
        >
          <Typography
            component="span"
            variant="subtitle2"
            sx={{
              textTransform: "uppercase",
              fontWeight: 600,
              pr: 1,
            }}
          >
            {ref}
          </Typography>
          {name.replace(/^•\s/g, "")}
        </Typography>
      </div>
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

  const itemCount = itemData.length;
  const itemSize = 56;

  const getChildSize = (child: React.ReactChild) => {
    // eslint-disable-next-line no-prototype-builtins
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    const charsInLine = 58;
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

const IncludeCollectionFilter = () => {
  const { t } = useTranslation("settings");

  const { categories, isLoadingCategories } = useTextLists();

  const [includeCollectonParam, setIncludeCollectonParam] = useQueryParam(
    // TODO: replace with "include_collection",
    "limit_collection",
    ArrayParam
  );

  const [includeCollectonValue, setIncludeCollectonValue] = useState<
    CategoryMenuItem[]
  >([]);

  useEffect(
    () =>
      setIncludeCollectonParam(
        includeCollectonParam ?? DEFAULT_QUERY_PARAMS.include_collection
      ),
    [includeCollectonParam, setIncludeCollectonParam]
  );

  const handleInputChange = (value: CategoryMenuItem[]) => {
    setIncludeCollectonValue(value);
    setIncludeCollectonParam(() => {
      return value.map((item) => item.id);
    });
  };

  return (
    <Box sx={{ my: 1, width: 1 }}>
      <Autocomplete
        id="excluded-collections"
        sx={{ mt: 1, mb: 2 }}
        multiple={true}
        value={includeCollectonValue ?? []}
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        options={[...categories.values()]}
        getOptionLabel={(option) => option.name.toUpperCase()}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t(`filtersLabels.includeCollections`)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoadingCategories ? (
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
        loading={isLoadingCategories}
        filterSelectedOptions
        disablePortal
        onChange={(event, value) => handleInputChange(value)}
      />
    </Box>
  );
};

export default IncludeCollectionFilter;
