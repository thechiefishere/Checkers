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

export const isRegularMove = (fromBox, toBox, direction) => {
  if (toBox.isFilled) return false;
  let validMove = false;
  if (direction === "DOWN")
    validMove = checkRegularMoveDown(toBox.boxNumber, fromBox.boxNumber);
  else if (direction === "UP")
    validMove = checkRegularMoveUp(toBox.boxNumber, fromBox.boxNumber);
  return validMove;
};

const isSamePiece = (fromBox, middleBox) => {
  console.log("fromBox in samePiece", fromBox);
  console.log("middleBox in samePiece", middleBox);
  const pieceOne = fromBox.piece;
  const pieceTwo = middleBox.piece;
  if (pieceOne.pieceColor === pieceTwo.pieceColor) return true;
  return false;
};

export const isRegularKillMove = (fromBox, middleBox, toBox) => {
  // console.log("1");
  if (toBox.isFilled) return false;
  // console.log("2");
  if (!middleBox.isFilled) return false;
  // console.log("3");
  if (isSamePiece(fromBox, middleBox)) return false;
  // console.log("4");
  return true;
};
