// segment highlighting based on colors used for BuddhaNexus v1 site
// corrected for accessibility and with dark mode addition.
// original codes: https://github.com/search?q=repo%3ABuddhaNexus/buddhanexus-frontend%20SEGMENT_COLORS&type=code

export const LIGHT_MODE_MATCH_HEAT_COLORS = [
  "#1B365D", // fewest matches
  "#165666",
  "#0B6E5F",
  "#0A6C45",
  "#1B6B2C",
  "#4B6B16",
  "#A65D00",
  "#B84B1D",
  "#C13829",
  "#DD1240", // most matches
] as const;

// colours are "counter inverted" to adjust for css dark mode filter
// NOTE: These colours have been tested for WCAG compliance. Some colour
// contrast checkers will not recognize the css invert and fail
// the a11y test, but this is a false negative.
export const DARK_MODE_MATCH_HEAT_INVERTED_COLORS = [
  "#170C05", // fewest matches (inverted from #E8F3FA)
  "#2E1512", // inverted from #D1EAED
  "#360D10", // inverted from #C9F2EF
  "#2A055F", // inverted from #D5FFCF
  "#32055F", // inverted from #CDFAA0
  "#22096F", // inverted from #DDF590
  "#1A1288", // inverted from #E5ED77
  "#122688", // inverted from #EDD977
  "#00356B", // inverted from #FFCA94
  "#00704F", // inverted from #FF8FB0 - most matches
] as const;
