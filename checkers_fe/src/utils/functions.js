export const getColorFromDimensions = (leftDimension, topDimension) => {
  if (topDimension === leftDimension) return "red";
  if (topDimension % 2 === 0 && leftDimension % 2 === 0) return "black";
  else if (topDimension % 2 === 0 && leftDimension % 2 != 0) return "yellow";
  else if (topDimension % 2 != 0 && leftDimension % 2 === 0) return "yellow";
  else if (topDimension % 2 != 0 && leftDimension % 2 != 0) return "black";
};
