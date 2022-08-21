import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getI18NextStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
