const checkRegularMoveDown = (toBoxNumber, fromBoxNumber) => {
  let boxDifference = toBoxNumber - fromBoxNumber;
  if (boxDifference < 0) return false;
  if (fromBoxNumber % 10 === 0 && boxDifference === 11) return true;
  if (fromBoxNumber % 10 === 9 && boxDifference === 9) return true;
  else if (boxDifference === 9 || boxDifference === 11) return true;
  return false;
};

const checkRegularMoveUp = (toBoxNumber, fromBoxNumber) => {
  let boxDifference = fromBoxNumber - toBoxNumber;
  if (boxDifference < 0) return false;
  if (fromBoxNumber % 10 === 0 && boxDifference === 9) return true;
  if (fromBoxNumber % 10 === 9 && boxDifference === 11) return true;
  else if (boxDifference === 9 || boxDifference === 11) return true;
  return false;
};

export const isValidRegularMove = (fromBox, toBox, direction) => {
  if (toBox.isFilled) return false;
  let validMove = false;
  if (direction === "DOWN")
    validMove = checkRegularMoveDown(toBox.boxNumber, fromBox.boxNumber);
  else if (direction === "UP")
    validMove = checkRegularMoveUp(toBox.boxNumber, fromBox.boxNumber);
  return validMove;
};

export const isValidRegularKillMove = (fromBox, toBox, direction) => {
  if (toBox.isFilled) return false;
};
