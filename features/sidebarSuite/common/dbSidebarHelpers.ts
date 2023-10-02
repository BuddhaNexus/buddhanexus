import type { DbViewEnum } from "@components/hooks/useDbView";
import type { SvgIconTypeMap } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type {
  MenuOmission,
  MenuSetting,
  UtilityOption,
} from "features/sidebarSuite/config/types";
import type { SourceLanguage } from "utils/constants";

/**
 * Next JS stores dynamic routes in the router object query prop which is also where api query params are pushed to. Dynamic route params need to be removed to avoid polluting result page urls and sending unaccepted params in api requests.
 *
 * @see {@link https://nextjs.org/docs/pages/api-reference/functions/use-router#router-object}.
 *
 */
export const getQueryParamsFromRouter = ({
  route,
  params,
}: {
  route: string;
  params: URLSearchParams;
}): URLSearchParams => {
  const paramsWithoutDynamicRouteProps = new URLSearchParams(params);
  paramsWithoutDynamicRouteProps.delete("file");

  if (!route.startsWith("/search")) {
    paramsWithoutDynamicRouteProps.delete("language");
  }

  return paramsWithoutDynamicRouteProps;
};

export const isSettingOmitted = ({
  omissions,
  settingName,
  language,
  view,
}: {
  omissions: MenuOmission;
  settingName: MenuSetting;
  language: SourceLanguage;
  view: DbViewEnum;
}) => {
  return Boolean(
    omissions?.[settingName]?.[view]?.some((omittedLang) =>
      ["allLangs", language].includes(omittedLang)
    )
  );
};

type UtilityOptionProps = {
  callback: (props: UtilityClickHandlerProps) => void;
  icon: OverridableComponent<SvgIconTypeMap>;
};

export type UtilityOptions = {
  [value in UtilityOption]: UtilityOptionProps;
};

export type PopperAnchorState = Record<UtilityOption, HTMLElement | null>;

type PopperUtilityStates<State> = [
  State,
  React.Dispatch<React.SetStateAction<State>>
];
type PopperAnchorStateHandler = PopperUtilityStates<PopperAnchorState>;

interface UtilityClickHandlerProps {
  event: React.MouseEvent<HTMLElement>;
  fileName: string;
  download: {
    call: (url: string, name: string) => void;
    file: { url: string; name: string } | undefined;
  };
  href: string;
  popperAnchorStateHandler: PopperAnchorStateHandler;
}

export const defaultAnchorEls = {
  download: null,
  copyQueryTitle: null,
  copyQueryLink: null,
  emailQueryLink: null,
};

export const onDownload = ({
  download,
  event,
  popperAnchorStateHandler,
}: UtilityClickHandlerProps) => {
  const [anchorEl, setAnchorEl] = popperAnchorStateHandler;

  if (download?.file) {
    const { call: getDownload, file } = download;

    getDownload(file.url, file.name);
  }

  setAnchorEl({
    ...defaultAnchorEls,
    download: anchorEl.download ? null : event.currentTarget,
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
}: UtilityClickHandlerProps) => {
  const [anchorEl, setAnchorEl] = popperAnchorStateHandler;

  const encodedURL = encodeURIComponent(href);

  const subject = `BuddhaNexus serach results - ${fileName.toUpperCase()}`;
  const body = `Here is a link to search results for ${fileName.toUpperCase()}: ${encodedURL}`;

  const link = document.createElement("a");
  link.href = `mailto:?subject=${subject}&body=${body}`;
  link.click();
  setAnchorEl({
    ...defaultAnchorEls,
    emailQueryLink: anchorEl.emailQueryLink ? null : event.currentTarget,
  });
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
