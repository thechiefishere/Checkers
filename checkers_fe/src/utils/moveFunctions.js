import { getBoxByNumber } from "./functions";

const isValidAtEdge = (fromBoxNumber, toBoxNumber, boxDifference) => {
  if (toBoxNumber > fromBoxNumber) {
    if (fromBoxNumber % 10 === 0 && boxDifference % 9 === 0) return false;
    if (fromBoxNumber % 10 === 9 && boxDifference % 11 === 0) return false;
  } else {
    if (fromBoxNumber % 10 === 0 && boxDifference % 11 === 0) return false;
    if (fromBoxNumber % 10 === 9 && boxDifference % 9 === 0) return false;
  }
  return true;
};

const checkRegularMove = (toBoxNumber, fromBoxNumber, direction) => {
  let boxDifference = toBoxNumber - fromBoxNumber;
  if (direction === "UP") boxDifference = fromBoxNumber - toBoxNumber;
  if (boxDifference < 0) return false;
  if (!isValidAtEdge(toBoxNumber, fromBoxNumber, boxDifference)) return false;
  if (boxDifference === 9 || boxDifference === 11) return true;
  return false;
};

export const isRegularMove = (fromBox, toBox, direction) => {
  if (toBox.isFilled) return false;
  let validMove = false;
  validMove = checkRegularMove(toBox.boxNumber, fromBox.boxNumber, direction);
  return validMove;
};

const isSamePieceColor = (fromBox, middleBox) => {
  const pieceOne = fromBox.piece;
  const pieceTwo = middleBox.piece;
  if (pieceOne.pieceColor === pieceTwo.pieceColor) return true;
  return false;
};

export const isRegularKillMove = (fromBox, middleBox, toBox) => {
  if (toBox.isFilled) return false;
  if (!middleBox.isFilled) return false;
  if (isSamePieceColor(fromBox, middleBox)) return false;
  return true;
};

const areMiddleBoxesEmpty = (fromBox, toBox, boxAddOn, allBoxes) => {
  boxAddOn = fromBox.boxNumber > toBox.boxNumber ? -boxAddOn : boxAddOn;
  for (let i = fromBox.boxNumber + boxAddOn; ; ) {
    if (i === toBox.boxNumber) return true;
    const box = getBoxByNumber(i, allBoxes);
    if (box.isFilled) return false;
    i += boxAddOn;
  }
  return true;
};

const canOneMiddleBoxBeKilled = (fromBox, toBox, boxAddOn, allBoxes) => {
  boxAddOn = fromBox.boxNumber > toBox.boxNumber ? -boxAddOn : boxAddOn;
  let filledBoxesCount = 0;
  for (let i = fromBox.boxNumber + boxAddOn; ; ) {
    if (i === toBox.boxNumber) break;
    const box = getBoxByNumber(i, allBoxes);
    if (box.isFilled) {
      if (isSamePieceColor(fromBox, box)) return false;
      else filledBoxesCount++;
    }
    if (filledBoxesCount === 2) return false;
    i += boxAddOn;
  }
  return true;
};

export const isKingMove = (fromBox, toBox, allBoxes) => {
  const boxDifference = Math.abs(toBox.boxNumber - fromBox.boxNumber);
  if (!boxDifferencePass(fromBox, toBox, boxDifference)) return false;
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

const boxDifferencePass = (fromBox, toBox, boxDifference) => {
  if (toBox.isFilled) return false;
  if (boxDifference % 9 !== 0 && boxDifference % 11 !== 0) return false;
  if (boxDifference === 11 || boxDifference === 9) {
    if (!isValidAtEdge(toBox.boxNumber, fromBox.boxNumber, boxDifference))
      return false;
  }
  return true;
};

export const isKingKill = (fromBox, toBox, allBoxes) => {
  const boxDifference = Math.abs(toBox.boxNumber - fromBox.boxNumber);
  if (!boxDifferencePass(fromBox, toBox, boxDifference))
    return { valid: false, middleBox: null };
  const boxAddOn = boxDifference % 11 === 0 ? 11 : 9;
  const pieceCanDie = canOneMiddleBoxBeKilled(
    fromBox,
    toBox,
    boxAddOn,
    allBoxes
  );
  if (pieceCanDie) {
    const box = getMiddleBox(fromBox, toBox, boxAddOn, allBoxes);
    return { valid: true, middleBox: box };
  }
  return { valid: false, middleBox: null };
};

export const getMiddleBox = (fromBox, toBox, boxAddOn, allBoxes) => {
  boxAddOn = fromBox.boxNumber > toBox.boxNumber ? -boxAddOn : boxAddOn;
  for (let i = fromBox.boxNumber + boxAddOn; ; ) {
    if (i === toBox.boxNumber) break;
    const box = getBoxByNumber(i, allBoxes);
    if (box.isFilled) return box;
    i += boxAddOn;
  }
  return null;
};
