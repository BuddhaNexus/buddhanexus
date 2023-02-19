/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * https://mui.com/material-ui/react-autocomplete/
 * https://codesandbox.io/s/2326jk?file=/demo.tsx
 */

import React, { useEffect, useState } from "react";
import { type ListChildComponentProps, VariableSizeList } from "react-window";
// import { useTranslation } from "next-i18next";
import type { DatabaseCategory, DatabaseText } from "@components/db/types";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import {
  Autocomplete,
  autocompleteClasses,
  Box,
  // Chip,
  CircularProgress,
  ListSubheader,
  Popper,
  // Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/styles";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "utils/api/dbApi";

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
          wordBreak: "break-all",
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

const InclusionExclusionFilters = () => {
  const { sourceLanguage, queryParams, setQueryParams, serializedParams } =
    useDbQueryParams();
  // const { t } = useTranslation();

  interface Inclusions {
    excludedCategories: DatabaseCategory["categoryName"][];
    excludedFiles: DatabaseText["fileName"][];
    includedCategories: DatabaseCategory["categoryName"][];
    includedFiles: DatabaseText["fileName"][];
  }

  const [queryValues, setQueryValues] = useState<Inclusions>({
    excludedCategories: [],
    excludedFiles: [],
    includedCategories: [],
    includedFiles: [],
  });

  const handleInputChange = (
    values: (DatabaseCategory | DatabaseText)[],
    type: keyof Inclusions
  ) => {
    if (type.includes("Categories")) {
      setQueryValues({
        ...queryValues,
        [type]: values.map(
          (value) => "categoryName" in value && value.categoryName
        ) as DatabaseCategory["categoryName"][],
      });
    }
    if (type.includes("Files")) {
      setQueryValues({
        ...queryValues,
        [type]: values.map(
          (value) => "fileName" in value && value.fileName
        ) as DatabaseText["fileName"][],
      });
    }
  };

  const handleBlur = () => {
    const params = Object.entries(queryValues).flatMap(([key, value]) =>
      key.includes("excluded") ? value.map((item: string) => `!${item}`) : value
    );

    setQueryParams({
      limit_collection: params.length > 0 ? params : undefined,
    });
  };

  // useEffect(() => {
  //   if (!queryParams.limit_collection && !inclusions && !exclusions) {
  //     setInclusions(undefined);
  //     setExclusions(undefined);
  //     return;
  //   }

  //   const inclusionList = queryParams.limit_collection?.filter(
  //     (item) => !item?.includes("!")
  //   ) as DatabaseText["fileName"][];

  //   const exclusionList = queryParams.limit_collection?.filter((item) =>
  //     item?.includes("!")
  //   ) as DatabaseText["fileName"][];

  //   setInclusions(inclusionList);
  //   setExclusions(exclusionList);
  // }, [queryParams]);

  useEffect(() => {}, [queryParams]);

  const { data: files, isLoading } = useQuery<DatabaseText[]>({
    queryKey: DbApi.LanguageMenu.makeQueryKey(sourceLanguage),
    queryFn: () => DbApi.LanguageMenu.call(sourceLanguage),
  });

  const { data: categories, isLoading: isLoadingCats } = useQuery<
    DatabaseCategory[]
  >({
    queryKey: DbApi.CategoryMenu.makeQueryKey(sourceLanguage),
    queryFn: () => DbApi.CategoryMenu.call(sourceLanguage),
  });

  return (
    <Box sx={{ my: 1, width: "100%" }}>
      <Typography sx={{ mb: 2 }}>Include and exclude texts</Typography>
      <Autocomplete
        id="exclude-collections"
        sx={{ mb: 2 }}
        multiple={true}
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        options={categories ?? []}
        getOptionLabel={(option) => option.name.toUpperCase()}
        // groupBy={(option) => option.category.toUpperCase()}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Exclude collections"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoadingCats ? (
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
        loading={isLoadingCats}
        filterSelectedOptions
        disableListWrap
        disablePortal
        onChange={(event, value) =>
          handleInputChange(value, "excludedCategories")
        }
        onBlur={handleBlur}
      />
      <Autocomplete
        id="exclude-files"
        sx={{ mb: 2 }}
        multiple={true}
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        options={files ?? []}
        getOptionLabel={(option) => option.name.toUpperCase()}
        groupBy={(option) => option.category.toUpperCase()}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Exclude texts"
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
        filterSelectedOptions
        disableListWrap
        disablePortal
        onChange={(event, value) => handleInputChange(value, "excludedFiles")}
        onBlur={handleBlur}
      />

      <Autocomplete
        id="include-collections"
        sx={{ mb: 2 }}
        multiple={true}
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        options={categories ?? []}
        getOptionLabel={(option) => option.name.toUpperCase()}
        // groupBy={(option) => option.category.toUpperCase()}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Only include collections"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoadingCats ? (
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
        loading={isLoadingCats}
        filterSelectedOptions
        disableListWrap
        disablePortal
        onChange={(event, value) =>
          handleInputChange(value, "includedCategories")
        }
        onBlur={handleBlur}
      />
      <Autocomplete
        id="include-files"
        multiple={true}
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        options={files ?? []}
        getOptionLabel={(option) => option.name.toUpperCase()}
        groupBy={(option) => option.category.toUpperCase()}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Only include texts"
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
        filterSelectedOptions
        disableListWrap
        disablePortal
        onChange={(event, value) => handleInputChange(value, "includedFiles")}
        onBlur={handleBlur}
      />
    </Box>
  );
};

export default InclusionExclusionFilters;
