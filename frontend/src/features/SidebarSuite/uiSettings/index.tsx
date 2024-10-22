import {
  onCopyQueryLink,
  onCopyQueryTitle,
  onDownload,
  onEmailQueryLink,
  type UtilityOptionProps,
} from "@features/SidebarSuite/TabContent/UtilityOptionsSection/utils";
import {
  DisplayUISettingName,
  RequestFilterUISettingName,
  UtilityUISettingName,
} from "@features/SidebarSuite/types";
import { SegmentOptions } from "@features/SidebarSuite/uiSettings/SegmentOptions";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

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

export const utilityComponents: Record<
  UtilityUISettingName,
  UtilityOptionProps
> = {
  download_data: {
    callback: onDownload,
    icon: FileDownloadIcon,
  },
  copyQueryTitle: {
    callback: onCopyQueryTitle,
    icon: LocalOfferOutlinedIcon,
  },
  copyQueryLink: {
    callback: onCopyQueryLink,
    icon: ShareOutlinedIcon,
  },
  emailQueryLink: {
    callback: onEmailQueryLink,
    icon: ForwardToInboxIcon,
  },
};
