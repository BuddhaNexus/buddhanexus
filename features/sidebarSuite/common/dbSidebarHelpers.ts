import type { SvgIconTypeMap } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { UtilityOption } from "features/sidebarSuite/config/settings";
import type {
  MenuOmission,
  MenuSetting,
  QueryParams,
  SettingOmissionContext,
} from "features/sidebarSuite/config/types";
import type { Script } from "features/sidebarSuite/subComponents/settings/TextScriptOption";
import { EwtsConverter } from "tibetan-ewts-converter";
import { getParallelDownloadData } from "utils/api/downloads";
import { SourceLanguage } from "utils/constants";

export const isSettingOmitted = ({
  omissions,
  settingName,
  language,
  pageContext,
}: {
  omissions: MenuOmission;
  settingName: MenuSetting;
  language: SourceLanguage;
  pageContext: SettingOmissionContext;
}) => {
  return Boolean(
    omissions?.[settingName]?.[pageContext]?.some((omittedLang) =>
      ["all", language].includes(omittedLang),
    ),
  );
};

export type PopperAnchorState = Record<UtilityOption, HTMLElement | null>;

type PopperUtilityStates<State> = [
  State,
  React.Dispatch<React.SetStateAction<State>>,
];
type PopperAnchorStateHandler = PopperUtilityStates<PopperAnchorState>;

interface UtilityClickHandlerProps {
  event: React.MouseEvent<HTMLElement>;
  fileName: string;
  download: {
    call: (url: string, name: string) => void;
    fileName: string;
    queryParams: Partial<QueryParams>;
  };
  href: string;
  popperAnchorStateHandler: PopperAnchorStateHandler;
  messages: {
    subject: string;
  };
}

type UtilityOptionProps = {
  callback: (props: UtilityClickHandlerProps) => void;
  icon: OverridableComponent<SvgIconTypeMap>;
};

export type UtilityOptions = {
  [value in UtilityOption]: UtilityOptionProps;
};

export const defaultAnchorEls = {
  download: null,
  copyQueryTitle: null,
  copyQueryLink: null,
  emailQueryLink: null,
};

export const onDownload = async ({
  download,
  event,
  popperAnchorStateHandler,
}: UtilityClickHandlerProps) => {
  const [anchorEl, setAnchorEl] = popperAnchorStateHandler;

  const file = await getParallelDownloadData({
    fileName: download.fileName,
    queryParams: download.queryParams,
  });

  if (file) {
    const { call: getDownload } = download;

    getDownload(file.url, file.name);
  }

  setAnchorEl({
    ...defaultAnchorEls,
    download: anchorEl.download
      ? null
      : (event.nativeEvent.target as HTMLElement),
  });
};

export const onCopyQueryTitle = async ({
  event,
  fileName,
  popperAnchorStateHandler,
}: UtilityClickHandlerProps) => {
  const [anchorEl, setAnchorEl] = popperAnchorStateHandler;

  setAnchorEl({
    ...defaultAnchorEls,
    copyQueryTitle: anchorEl.copyQueryTitle ? null : event.currentTarget,
  });

  await navigator.clipboard.writeText(fileName);
};

export const onCopyQueryLink = async ({
  event,
  popperAnchorStateHandler,
  href,
}: UtilityClickHandlerProps) => {
  const [anchorEl, setAnchorEl] = popperAnchorStateHandler;

  setAnchorEl({
    ...defaultAnchorEls,
    copyQueryLink: anchorEl.copyQueryLink ? null : event.currentTarget,
  });

  await navigator.clipboard.writeText(href);
};

export const onEmailQueryLink = ({
  event,
  fileName,
  popperAnchorStateHandler,
  href,
  messages,
}: UtilityClickHandlerProps) => {
  const [anchorEl, setAnchorEl] = popperAnchorStateHandler;

  const encodedURL = encodeURI(href);

  const subject = fileName
    ? `${messages.subject} - ${fileName.toUpperCase()}`
    : messages.subject;

  const link = document.createElement("a");
  link.href = `mailto:?subject=${subject}&body=${encodedURL}`;
  link.click();
  setAnchorEl({
    ...defaultAnchorEls,
    emailQueryLink: anchorEl.emailQueryLink ? null : event.currentTarget,
  });

  link.remove();
};

const ewts = new EwtsConverter();
export const enscriptText = ({
  text,
  language,
  script,
}: {
  text: string;
  language: SourceLanguage;
  script: Script;
}) => {
  return script === "Wylie" && language === SourceLanguage.TIBETAN
    ? ewts.to_unicode(text)
    : text;
};

//  TODO: clarify spec - is disabling logically impossible (per include/exclude filter selections) desired behaviour? Applies to all included/excluded filters.
//
//   const [disableSelectors, setDisableSelectors] = useAtom(
//     disableLimitColectionSelectAtom
//   );

//   function setIsSelectorDisabled(
//     key: keyof QueryValues["limit_collection"],
//     value: boolean
//   ) {
//     setDisableSelectors((prevState) => {
//       const updates = {
//         excludedCategories: {},
//         excludedTexts: {},
//         includedCategories: {
//           excludedCategories: !value,
//           excludedTexts: !value,
//         },
//         includedTexts: {
//           excludedCategories: !value,
//           excludedTexts: !value,
//           includedCategories: !value,
//         },
//       };
//       return { ...prevState, ...updates[key] };
//     });
//   }
