import { useEffect } from "react";
import { useRouter } from "next/router";
import { atom, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// eslint-disable-next-line no-shadow
export enum DbViewEnum {
  GRAPH = "graph",
  NUMBERS = "numbers",
  TABLE = "table",
  TEXT = "text",
}

export const currentViewAtom = atom<DbViewEnum>(DbViewEnum.TABLE);
export const shouldHideSegmentNumbersAtom = atomWithStorage<boolean>(
  "shouldHideSegmentNumbers",
  false,
);
export const shouldUseOldSegmentColorsAtom = atomWithStorage<boolean>(
  "shouldUseOldSegmentColors",
  false,
);

const initiateView = (view: DbViewEnum | string): DbViewEnum => {
  if (Object.values(DbViewEnum).includes(view as DbViewEnum)) {
    return view as DbViewEnum;
  }
  return DbViewEnum.TABLE;
};

// This allows two-way view setting: url <--> view selector
export const useDbView = () => {
  const { pathname } = useRouter();
  const setCurrentView = useSetAtom(currentViewAtom);

  const pathnameParts = pathname.split("/");
  const pathnameView = pathnameParts.at(-1) ?? DbViewEnum.TABLE;

  useEffect(() => {
    setCurrentView(initiateView(pathnameView));
  }, [pathnameView, setCurrentView]);
};
