import { useTranslation } from "next-i18next";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const IS_DISABLED_PENDING_388 = true;

export default function NoSearchResultsFound() {
  const { t } = useTranslation();

  return (
    <>
      <Typography>
        <Box component="span" fontWeight="500">
          {t("prompts.noResults")}
        </Box>{" "}
        {t("search.noResultsTip")}
      </Typography>
      {IS_DISABLED_PENDING_388 ? null : (
        <>
          <Box sx={{ mt: 2, ml: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CheckCircle color="success" />
              <Typography ml={1}>
                buddho&apos;ha cācalaḥ siddhaḥ prajñāpāramitā priyā
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Cancel color="error" />
              <Typography ml={1}>
                buddho&apos;ha cācalaḥ siddhaḥ prajñāpāramitā priy
                <span style={{ fontWeight: "bold" }}>a</span>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Cancel color="error" />
              <Typography ml={1}>
                buddho&apos;ha cācalaḥ siddhaḥ prajñāpāramitā{" "}
                <span style={{ fontWeight: "bold" }}>pr</span>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Cancel color="error" />
              <Typography ml={1}>
                buddh<span style={{ fontWeight: "bold" }}>oh</span>a cācalaḥ
                siddhaḥ prajñāpāramitā priyā
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 2, ml: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CheckCircle color="success" />
              <Typography ml={1}>
                །བཅོམ་ལྡན་འདས་བྱང་ཆུབ་སེམས་དཔའ་སེམས་དཔའ་ཆེན
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Cancel color="error" />
              <Typography ml={1}>
                །བཅོམ་ལྡན་འདས་བྱང་ཆུབ་སེམས་དཔའ་སེམས་དཔའ་
                <span style={{ fontWeight: "bold" }}>ཆེ</span>
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
