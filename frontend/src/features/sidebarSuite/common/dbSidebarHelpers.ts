import type {
  AllUIComponentParamNames,
  AppResultPageView,
  Script,
  UtilityUISettingName,
} from "@features/sidebarSuite/types";
import type { SvgIconTypeMap } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import { getParallelDownloadData } from "@utils/api/endpoints/table-view/downloads";
import { DbLanguage } from "@utils/api/types";
import { EwtsConverter } from "tibetan-ewts-converter";

export type PopperAnchorState = Record<
  UtilityUISettingName,
  HTMLElement | null
>;

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
    queryParams: Partial<AllUIComponentParamNames>;
  };
  href: string;
  popperAnchorStateHandler: PopperAnchorStateHandler;
  messages: {
    subject: string;
  };
}

export type UtilityOptionProps = {
  callback: (props: UtilityClickHandlerProps) => void;
  icon: OverridableComponent<SvgIconTypeMap>;
};

export const defaultAnchorEls = {
  download_data: null,
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

  const { fileName, queryParams } = download;

  // const file = await getParallelDownloadData({
  //   filename: fileName,
  //   ...queryParams,
  //   // TODO: determine what is needed for this prop
  //   download_data: "",
  // });

  const file = {
    name: fileName,
    url: "",
  };

  if (file) {
    const { call: getDownload } = download;

    getDownload(file.url, file.name);
  }

  setAnchorEl({
    ...defaultAnchorEls,
    download_data: anchorEl.download_data
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
  text?: string;
  language: DbLanguage | undefined;
  script: Script;
}) => {
  return script === "Unicode" && language === "bo"
    ? ewts.to_unicode(text)
    : text;
};
