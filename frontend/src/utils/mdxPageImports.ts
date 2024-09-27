import { Link } from "@components/common/Link";
import Event, { projectYearWidth } from "@components/static/Event";
import PartnerInstitution from "@components/static/PartnerInstitution";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import LaunchIcon from "@mui/icons-material/Launch";
import MenuIcon from "@mui/icons-material/Menu";
import ACIPImage from "public/assets/images/partner_acip.jpg";
import CbetaImage from "public/assets/images/partner_beta.jpg";
import BDRCImage from "public/assets/images/partner_buddhist_digital_resource_center.jpg";
import CbcImage from "public/assets/images/partner_cbc.png";
import DHIIImage from "public/assets/images/partner_digital_humanities.jpg";
import DSBCImage from "public/assets/images/partner_dsbc.jpg";
import KhyentseCenterImage from "public/assets/images/partner_khyentse_center.jpg";
import KanjurImage from "public/assets/images/partner_rkts.jpg";
import SubImage from "public/assets/images/partner_sub.jpg";
import SuttaCentralImage from "public/assets/images/partner_sutta_central.jpg";
import GoettingenImage from "public/assets/images/partner_uni_goettingen.jpg";
import UHHImage from "public/assets/images/partner_uni_hamburg.jpg";
import UwestImage from "public/assets/images/partner_uwest.jpg";
import ViennaImage from "public/assets/images/partner_vienna.jpg";
import VRIImage from "public/assets/images/partner_vipassana_research_institute.jpg";

export type MDXPageDataStore = Record<string, any>;

export const MDX_COMPONENTS: MDXPageDataStore = {
  KeyboardDoubleArrowUpIcon,
  ExploreOutlinedIcon,
  LaunchIcon,
  MenuIcon,
  Event,
  PartnerInstitution,
  Link,
};

export const MDX_PROPS: MDXPageDataStore = {
  projectYearWidth,
};

export const MDX_IMPORTS: MDXPageDataStore = {
  ACIPImage,
  CbetaImage,
  BDRCImage,
  CbcImage,
  DHIIImage,
  DSBCImage,
  KhyentseCenterImage,
  KanjurImage,
  SubImage,
  SuttaCentralImage,
  GoettingenImage,
  UHHImage,
  UwestImage,
  ViennaImage,
  VRIImage,
};
