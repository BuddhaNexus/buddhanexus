import React from "react";
import { Typography } from "@mui/material";
import { SourceLanguage } from "utils/constants";

const PaliLanguageDescription = () => {
  return (
    <>
      <Typography variant="body1" sx={{ my: 2 }}>
        The Pāli textual corpus used in BuddhaNexus was obtained from the
        Mahāsaṅgīti Tipiṭaka Buddhavasse 2500: World Tipiṭaka Edition in Roman
        Script. Edited and published by The M.L. Maniratana Bunnag Dhamma
        Society Fund, 2005. Based on the digital edition of the Chaṭṭha
        Saṅgāyana published by the Vipassana Research Institute (VRI), with
        corrections and proofreading by the Dhamma Society.
      </Typography>
      The Sutta, Vinaya, and Abhidhamma texts have been sourced from the
      SuttaCentral JSON-based segmented texts (Bilara), which have been
      extensively tested to ensure integrity and correctness. These texts have
      the same segment numbers as in SuttaCentral and are linked to the
      corresponding segments on that site.
      <Typography variant="body1" sx={{ my: 2 }}>
        The remaining commentary texts of the Aṭṭhakathā, Tikā, and Anya have
        been sourced from the Chaṭṭha Saṅgāyana as published by the Vipassana
        Research Institute.
      </Typography>
      <Typography>
        For the calculation of the Pāli matches, SuttaCentral’s hyphenation and
        stemming algorithms have been used. The minimum match length used in the
        calculations is 30 characters. We believe that shorter matches are not
        useful for the purpose of finding parallels.
      </Typography>
      <Typography variant="body2" sx={{ my: 2 }}>
        Background image: Courtesy of the Fragile Palm Leaves Collection,
        Bangkok.
      </Typography>
    </>
  );
};

export const LanguageDescription = ({ lang }: { lang: SourceLanguage }) => {
  if (lang === SourceLanguage.PALI) {
    return <PaliLanguageDescription />;
  }
  // TODO: add descriptions for all source languages
  return null;
};
