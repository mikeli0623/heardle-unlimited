export const strictRound = (num, margin = 0.1) => {
  if (num < Math.round(num) && num > Math.round(num) - margin)
    return Math.round(num);
  else if (num > Math.round(num) && num < Math.round(num) + margin)
    return Math.round(num);
  return num;
};
