const { boxColors } = require("../constants");

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

const isRegularMove = (fromBox, toBox, direction) => {
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

const getMiddleBox = (fromBox, toBox, allBoxes) => {
  const middleBoxAddOn = Math.abs(fromBox.boxNumber - toBox.boxNumber) / 2;
  if (middleBoxAddOn !== 9 && middleBoxAddOn !== 11) return null;
  const middleBoxIndex =
    toBox.boxNumber > fromBox.boxNumber
      ? fromBox.boxNumber + middleBoxAddOn
      : fromBox.boxNumber - middleBoxAddOn;
  const middleBox = allBoxes[middleBoxIndex];
  return middleBox;
};

const isRegularKillMove = (fromBox, toBox, allBoxes) => {
  if (toBox.isFilled) return { valid: false, middleBox: null };
  const middleBox = getMiddleBox(fromBox, toBox, allBoxes);
  if (
    !middleBox ||
    !middleBox.isFilled ||
    middleBox.boxNumber % 10 === 9 ||
    middleBox.boxNumber % 10 === 0
  )
    return { valid: false, middleBox: null };
  if (isSamePieceColor(fromBox, middleBox))
    return { valid: false, middleBox: null };
  return { valid: true, middleBox };
};

const isKingMove = (fromBox, toBox, allBoxes) => {
  const boxDifference = getBoxDifference(fromBox, toBox);
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
  if (toBox.boxColor === boxColors[2]) return false;
  if (boxDifference % 9 !== 0 && boxDifference % 11 !== 0) return false;
  if (boxDifference === 11 || boxDifference === 9) {
    if (!isValidAtEdge(toBox.boxNumber, fromBox.boxNumber, boxDifference))
      return false;
  }
  return true;
};

const areMiddleBoxesEmpty = (fromBox, toBox, boxAddOn, allBoxes) => {
  boxAddOn = fromBox.boxNumber > toBox.boxNumber ? -boxAddOn : boxAddOn;
  for (let i = fromBox.boxNumber + boxAddOn; ; ) {
    if (i === toBox.boxNumber) return true;
    const box = allBoxes[i];
    if (box.isFilled) return false;
    i += boxAddOn;
  }
  return true;
};

const getBoxDifference = (fromBox, toBox) => {
  return Math.abs(toBox.boxNumber - fromBox.boxNumber);
};

module.exports = { isRegularMove, isRegularKillMove, getMiddleBox, isKingMove };
