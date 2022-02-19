export const getLeftDimension = (index) => {
  return index % 10;
};

export const getTopDimension = (index) => {
  return parseInt(index / 10);
};

export const getColorFromDimensions = (index) => {
  const leftDimension = getLeftDimension(index);
  const topDimension = getTopDimension(index);
  if (topDimension === leftDimension) return "RED";
  if (topDimension % 2 === 0 && leftDimension % 2 === 0) return "BLACK";
  else if (topDimension % 2 === 0 && leftDimension % 2 !== 0) return "YELLOW";
  else if (topDimension % 2 !== 0 && leftDimension % 2 === 0) return "YELLOW";
  else if (topDimension % 2 !== 0 && leftDimension % 2 !== 0) return "BLACK";
};
