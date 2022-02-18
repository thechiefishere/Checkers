export const getLeftDimension = (index) => {
  return index % 10;
};

export const getTopDimension = (index) => {
  return parseInt(index / 10);
};

export const getColorFromDimensions = (index) => {
  const leftDimension = getLeftDimension(index);
  const topDimension = getTopDimension(index);
  if (topDimension === leftDimension) return "red";
  if (topDimension % 2 === 0 && leftDimension % 2 === 0) return "black";
  else if (topDimension % 2 === 0 && leftDimension % 2 != 0) return "yellow";
  else if (topDimension % 2 != 0 && leftDimension % 2 === 0) return "yellow";
  else if (topDimension % 2 != 0 && leftDimension % 2 != 0) return "black";
};
