import { DbSourceTreeNode } from "@components/db/SearchableDbSourceTree/types";
import { SetStateAction } from "jotai";

type SetAtom<Args extends any[], Result> = (...args: Args) => Result;

export type CurrentDbFileAtom = Pick<
  DbSourceTreeNode,
  "id" | "displayId" | "name"
> | null;

export type SetCurrentDbFileAtom = SetAtom<
  [SetStateAction<CurrentDbFileAtom>],
  void
>;
