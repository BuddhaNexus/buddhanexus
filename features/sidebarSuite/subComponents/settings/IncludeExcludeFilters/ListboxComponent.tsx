import React from "react";
import { type ListChildComponentProps, VariableSizeList } from "react-window";
import { Tooltip, Typography } from "@mui/material";

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
const createMenuItemLable = (id: string, name: string) =>
  `${id}: ${trimName(name)}`;

const getNumberOfLines = (lable: string) => {
  const charsPerLine = 38;
  const lines = Math.ceil(lable.length / charsPerLine);
  return lines;
};

const Rows = (props: ListChildComponentProps) => {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
    fontWeight: 700,
  };
  const [dataSetProps, { name, id }] = dataSet;

  const lable = createMenuItemLable(id, name);
  const lines = getNumberOfLines(lable);

  return (
    <RowItem inheretedstyles={inlineStyle} {...dataSetProps} component="li">
      <ListLabelWapper>
        <Tooltip
          title={<Typography>{name}</Typography>}
          disableHoverListener={lines < maxLines}
        >
          <ListLabel>
            <ListLabelId component="span">{id}:</ListLabelId> {trimName(name)}
          </ListLabel>
        </Tooltip>
      </ListLabelWapper>
    </RowItem>
  );
};

const getChildSize = (child: React.ReactNode) => {
  // @ts-expect-error type issue
  const [itemProps] = child;
  const { id, key: name } = itemProps;
  const lines = getNumberOfLines(createMenuItemLable(id, name));
  const itemHeight = lines * lineHeight;

  return lines <= maxLines ? itemHeight : lineHeight * maxLines;
};

const getListHeight = (itemData: React.ReactNode[]) => {
  if (itemData.length > 8) {
    return 10 * defaultItemHeight;
  }
  return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
};

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: React.ReactNode[] = [];

  if (Array.isArray(children)) {
    children.forEach(
      (item: React.ReactNode & { children?: React.ReactNode[] }) => {
        itemData.push(item, ...(item.children ?? []));
      },
    );
  }

  const itemCount = itemData.length;

  const gridRef = useResetCache(itemCount);

  return (
    <ul ref={ref} style={{ padding: "0" }}>
      <OuterElementContext.Provider value={other}>
        {/* TODO: replace react-window with newer package */}
        {/* @ts-expect-error type issue */}
        <VariableSizeList
          ref={gridRef}
          itemData={itemData}
          height={getListHeight(itemData) + 2 * LISTBOX_PADDING}
          width="100%"
          // @ts-expect-error type issue
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index: number) => getChildSize(itemData[index] ?? 0)}
          overscanCount={5}
          itemCount={itemCount}
        >
          {Rows}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </ul>
  );
});

export default ListboxComponent;
