import type { UtilityOption } from "utils/dbUISettings";

type PopperUtilityStates<State> = [
  Record<UtilityOption, State>,
  React.Dispatch<React.SetStateAction<Record<UtilityOption, State>>>
];
type PopperAnchorState = PopperUtilityStates<HTMLElement | null>;

export interface UtilityClickHandlerProps {
  event: React.MouseEvent<HTMLElement>;
  fileName: string;
  download: {
    call: (url: string, name: string) => void;
    file: { url: string; name: string } | undefined;
  };
  href: string;
  popperAnchorState: PopperAnchorState;
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
  popperAnchorState,
}: UtilityClickHandlerProps) => {
  const [anchorEl, setAnchorEl] = popperAnchorState;

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
  popperAnchorState,
}: UtilityClickHandlerProps) => {
  const [anchorEl, setAnchorEl] = popperAnchorState;

  setAnchorEl({
    ...defaultAnchorEls,
    copyQueryTitle: anchorEl.copyQueryTitle ? null : event.currentTarget,
  });

  await navigator.clipboard.writeText(fileName);
};

export const onCopyQueryLink = async ({
  event,
  popperAnchorState,
  href,
}: UtilityClickHandlerProps) => {
  const [anchorEl, setAnchorEl] = popperAnchorState;

  setAnchorEl({
    ...defaultAnchorEls,
    copyQueryLink: anchorEl.copyQueryLink ? null : event.currentTarget,
  });

  await navigator.clipboard.writeText(href);
};

export const onEmailQueryLink = ({
  event,
  fileName,
  popperAnchorState,
  href,
}: UtilityClickHandlerProps) => {
  const [anchorEl, setAnchorEl] = popperAnchorState;

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
