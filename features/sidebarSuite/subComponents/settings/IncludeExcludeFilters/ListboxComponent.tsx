import React from "react";
import { type ListChildComponentProps, VariableSizeList } from "react-window";
import { ListSubheader } from "@mui/material";

import {
  ListLabel,
  ListLabelId,
  ListLabelWapper,
  RowItem,
} from "./muiStyledComponents";

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

const LISTBOX_PADDING = 8; // px
const maxLines = 3;
const defaultItemHeight = 56;
const lineHeight = 36;

const trimName = (name: string) => {
  return name.replaceAll(/^•\s/g, "");
};

const createLable = (id: string, name: string) => `${id}: ${trimName(name)}`;

const getNumberOfLines = (lable: string) => {
  const charsPerLine = 26;
  const lines = Math.ceil(lable.length / charsPerLine);
  return lines;
};

const Row = (props: ListChildComponentProps) => {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
    fontWeight: 700,
  };

  if (Object.hasOwn(dataSet, "group")) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  const [dataSetProps, { name, id }] = dataSet;

  const lable = createLable(id, name);
  const lines = getNumberOfLines(lable);

  return (
    <RowItem inheretedStyles={inlineStyle} {...dataSetProps} component="li">
      <ListLabelWapper>
        <ListLabel title={lines > maxLines ? lable : undefined}>
          <ListLabelId component="span">{id}:</ListLabelId> {trimName(name)}
        </ListLabel>
      </ListLabelWapper>
    </RowItem>
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
    },
  );

  const itemCount = itemData.length;

  const getChildSize = (child: React.ReactChild) => {
    // eslint-disable-next-line no-prototype-builtins
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    // @ts-expect-error type issue
    const [itemProps] = child;
    const { id, key: name } = itemProps;
    const lines = getNumberOfLines(createLable(id, name));
    const itemHeight = lines * lineHeight;

    return lines <= maxLines ? itemHeight : lineHeight * maxLines;
  };

  const getListHeight = () => {
    if (itemCount > 8) {
      return 10 * defaultItemHeight;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        {/* TODO: replace react-window with newer package */}
        {/* @ts-expect-error type issue */}
        <VariableSizeList
          ref={gridRef}
          itemData={itemData}
          height={getListHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          // @ts-expect-error type issue
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index: number) => getChildSize(itemData[index] ?? 0)}
          overscanCount={5}
          itemCount={itemCount}
        >
          {Row}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

export default ListboxComponent;
