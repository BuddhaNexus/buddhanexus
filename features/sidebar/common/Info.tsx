import { currentViewAtom } from "@components/hooks/useDbView";
import { Typography } from "@mui/material";
import type { DbView } from "features/sidebar/settingComponents/DbViewSelector";
import { useAtomValue } from "jotai";

// TODO: Determine relevant support info for sub-components & add to local files.
const TEMP_VIEW_INFO: Record<DbView, string> = {
  graph: `The pie-chart displays the distribution of all the matches found with the current filters across the various collections and their subsections. The distribution is weighted by length of matches found.

  The histogram displays the distribution of the top files that have matches with the Inquiry Text based on the accumulated length of the matches. A maximum of 50 Hit Texts are shown. 
  `,
  numbers:
    "Displays potential parallels by numbers sorted by segment as they appear in the text. ",
  table:
    "The matches can be sorted in three different ways: (1) by their position in the Inquiry Text, (2) by their position in the Hit Text(s), and (3) by the length of the match in the Hit Text. ",
  text: `

  The color coding of the syllables in the Inquiry Text indicates how many approximate matches are to be encountered at a certain syllable according to the current filter settings.
  
  Color codes per number of matches:
  0 	1 	2 	3 	4 	5 	6 	7 	8 	9 	10 or more
                      
    
  
  The minimum Match Length for Chinese texts has been set to 5 characters.
  `,
};

export const Info = () => {
  const currentView = useAtomValue(currentViewAtom);

  return (
    <>
      <Typography>{TEMP_VIEW_INFO[currentView]}</Typography>
      <Typography variant="h6" mt={2}>
        Tip example
      </Typography>
      <Typography>
        You can use the <kbd>Home</kbd> and <kbd>End</kbd> keys to jump to the
        beginning and end of loaded portions of a text.
      </Typography>
    </>
  );
};
