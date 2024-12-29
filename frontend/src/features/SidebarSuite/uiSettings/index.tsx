import type { JSX } from "react";
import {
  DisplayUISettingName,
  RequestFilterUISettingName,
} from "@features/SidebarSuite/types";
import { SegmentOptions } from "@features/SidebarSuite/uiSettings/SegmentOptions";

import { default as DbSourceFilter } from "./DbSourceFilter";
import { default as FolioOption } from "./FolioOption";
// import { default as MultiLingualSelector } from "./MultiLingualSelector";
import { default as ParLengthFilter } from "./ParLengthFilter";
import { default as ScoreFilter } from "./ScoreFilter";
import { default as SearchLanguageSelector } from "./SearchLanguageSelector";
import { default as SortOption } from "./SortOption";
import { default as TextScriptOption } from "./TextScriptOption";

export const filterComponents: Record<
  RequestFilterUISettingName,
  JSX.Element | null
> = {
  language: <SearchLanguageSelector />,
  score: <ScoreFilter />,
  par_length: <ParLengthFilter />,
  languages: null, // pending spec clarity re MultiLingualSelector
  exclude_sources: <DbSourceFilter filterName="exclude_sources" />,
  include_sources: <DbSourceFilter filterName="include_sources" />,
};

export const displaySettingComponents: Record<
  DisplayUISettingName,
  JSX.Element | null
> = {
  folio: <FolioOption />,
  sort_method: <SortOption />,
  script: <TextScriptOption />,
  showSegmentNrs: <SegmentOptions />,
};
