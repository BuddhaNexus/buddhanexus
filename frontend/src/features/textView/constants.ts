// segment highlighting based on colors used for BuddhaNexus v1 site
// corrected for accessibility and with dark mode addition.
// original codes: https://github.com/search?q=repo%3ABuddhaNexus/buddhanexus-frontend%20SEGMENT_COLORS&type=code

export const LIGHT_MODE_MATCH_HEAT_COLORS = [
  "#1B365D", // fewest matches
  "#165666",
  "#0B6E5F",
  "#0A5B3D",
  "#1B6B2C",
  "#485C00",
  "#7A4500",
  "#993600",
  "#B0481C",
  "#C6103B", // most matches
] as const;

// colours are "counter inverted" to adjust for css dark mode filter
// NOTE: These colours have been tested for WCAG compliance. Some colour
// contrast checkers will not recognize the css invert and fail
// the a11y test, but this is a false negative.
export const DARK_MODE_MATCH_HEAT_INVERTED_COLORS = [
  "#170C05", // fewest matches (inverted from #E8F3FA)
  "#2E1512", // inverted from #D1EAED
  "#360D10", // inverted from #C9F2EF
  "#5a1b31", // inverted from #A5E4CE
  "#611e6b", // inverted from #9DE193
  "#421f6f", // inverted from #BDE090
  "#3a3788", // inverted from #C5C877
  "#122688", // inverted from #EDD977
  "#00356B", // inverted from #FFCA94
  "#00573E", // inverted from #FFA8C1 - most matches
] as const;
