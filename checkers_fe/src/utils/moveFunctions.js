import { getBoxByNumber } from "./functions";

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
  const pieceOne = fromBox.piece;
  const pieceTwo = middleBox.piece;
  if (pieceOne.pieceColor === pieceTwo.pieceColor) return true;
  return false;
};

export const isRegularKillMove = (fromBox, middleBox, toBox) => {
  if (toBox.isFilled) return false;
  if (!middleBox.isFilled) return false;
  if (isSamePiece(fromBox, middleBox)) return false;
  return true;
};

const areMiddleBoxesEmpty = (fromBox, toBox, boxAddOn, allBoxes) => {
  boxAddOn = fromBox.boxNumber > toBox.boxNumber ? -boxAddOn : boxAddOn;
  let i = fromBox.boxNumber + boxAddOn;
  for (i; i < toBox.boxNumber; i += boxAddOn) {
    const box = getBoxByNumber(i, allBoxes);
    if (box.isFilled) return false;
  }
  return true;
};

export const isKingMove = (fromBox, toBox, allBoxes) => {
  if (toBox.isFilled) return false;
  const boxDifference = Math.abs(toBox.boxNumber - fromBox.boxNumber);
  if (boxDifference % 9 !== 0 && boxDifference % 11 !== 0) return false;
  const boxAddOn = boxDifference % 11 === 0 ? 11 : 9;
  const emptyMiddleBoxes = areMiddleBoxesEmpty(
    fromBox,
    toBox,
    boxAddOn,
    allBoxes
  );
  if (emptyMiddleBoxes) return true;
  return false;
};
