export const strictRound = (num) => {
  if (num < Math.round(num) && num > Math.round(num) - 0.1)
    return Math.round(num);
  else if (num > Math.round(num) && num < Math.round(num) + 0.1)
    return Math.round(num);
  return num;
};
