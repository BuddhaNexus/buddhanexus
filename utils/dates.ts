export const addDays = (date: Date, days: number) => {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
};
