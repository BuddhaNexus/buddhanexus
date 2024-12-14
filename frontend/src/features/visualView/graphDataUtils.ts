export function smoothGraphValues(value: number): number {
  // this function is used to determine how much large collections are shrinked and
  // smaller collections are enlarged, resulting in a compression effect that makes
  // the rendering of smaller entities more readable. a value of ** 1 means nothing
  // is changed. The smaller the value is, the stronger the graph is 'compressed'.
  return value ** 0.25;
}
