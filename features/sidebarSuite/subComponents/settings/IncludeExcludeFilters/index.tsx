import { useTranslation } from "next-i18next";
import { FormLabel } from "@mui/material";

import ExcludeCollectionFilter from "./ExcludeCollectionFilter";
import ExcludeTextFilter from "./ExcludeTextFilter";
import IncludeCollectionFilter from "./IncludeCollectionFilter";
import IncludeTextFilter from "./IncludeTextFilter";

const IncludeExcludeFilters = () => {
  const { t } = useTranslation("settings");

  return (
    <>
      <FormLabel id="exclude-include-filters-label">
        {t("filtersLabels.includeExcludeFilters")}
      </FormLabel>
      <ExcludeCollectionFilter />
      <ExcludeTextFilter />
      <IncludeCollectionFilter />
      <IncludeTextFilter />
    </>
  );
};

export default IncludeExcludeFilters;
